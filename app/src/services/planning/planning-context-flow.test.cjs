// Run with: node src/services/planning/planning-context-flow.test.cjs
const { readFileSync } = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const assert = require("node:assert/strict");
const { test } = require("node:test");
const Module = require("node:module");
const { planDay } = require("../../application/planning/plan-day.ts");
const {
  createEmptyPlanningContext,
} = require("../../application/planning-context/create-empty-planning-context.ts");
const {
  planningContextExample,
} = require("../../domain/planning-context/planning-context.example.ts");
const {
  dailyPlanExample,
} = require("../../application/planning/daily-plan.example.ts");
const {
  LocalPlanningContextProvider,
} = require("../../infrastructure/storage/local-planning-context-provider.ts");
const {
  dailyPlanningInputSchema,
} = require("./daily-planning-input-schema.ts");

// Stub the remote SDK, while exercising the real OpenAI adapter's input mapping.
let openAIRequest;
class FakeOpenAI {
  responses = {
    async parse(request) {
      openAIRequest = request;
      return { output_parsed: dailyPlanExample };
    },
  };
}
const originalLoad = Module._load;
let OpenAIDailyPlanner;
try {
  Module._load = function (id, ...args) {
    if (id === "openai") return FakeOpenAI;
    return originalLoad.call(this, id, ...args);
  };
  ({ OpenAIDailyPlanner } = require("./openai-daily-planner.ts"));
} finally {
  Module._load = originalLoad;
}

// Exercise the real API handler with the remote planner replaced by a fake.
const apiInputs = [];
let apiFailure = false;
let POST;
try {
  Module._load = function (id, ...args) {
    if (id === "@/services/planning/openai-daily-planner") {
      return {
        OpenAIDailyPlanner: class {
          async plan(input) {
            apiInputs.push(input);
            if (apiFailure) throw new Error("Remote unavailable");
            return dailyPlanExample;
          }
        },
      };
    }
    if (id === "@/services/planning/daily-planning-input-schema") {
      return { dailyPlanningInputSchema };
    }
    return originalLoad.call(this, id, ...args);
  };
  ({ POST } = require("../../app/api/plan+api.ts"));
} finally {
  Module._load = originalLoad;
}

function request(body) {
  return new Request("https://daily-os.test/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function localProvider() {
  const values = new Map();
  return new LocalPlanningContextProvider({
    async getItem(key) {
      return values.get(key) ?? null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
  });
}

test("loads saved context before planning and preserves user text verbatim", async (t) => {
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date("2026-10-22T12:00:00Z"),
  });
  const events = [];
  const text = "  Plan a quiet day.\nLeave time for reading.  ";
  const result = await planDay(
    text,
    {
      async load() {
        events.push("load");
        return planningContextExample;
      },
    },
    {
      async plan(input) {
        events.push("plan");
        assert.deepEqual(input, {
          context: text,
          planningDate: "2026-10-22",
          planningContext: planningContextExample,
        });
        return dailyPlanExample;
      },
    },
  );
  assert.deepEqual(events, ["load", "plan"]);
  assert.equal(result, dailyPlanExample);
});

test("loads the latest persisted context on every request, including empty defaults", async (t) => {
  t.mock.timers.enable({
    apis: ["Date"],
    now: new Date("2026-10-22T12:00:00Z"),
  });
  const provider = localProvider();
  const inputs = [];
  const planner = {
    async plan(input) {
      inputs.push(input);
      return dailyPlanExample;
    },
  };
  await planDay("First", provider, planner);
  assert.deepEqual(
    inputs[0].planningContext,
    createEmptyPlanningContext(inputs[0].planningContext.timeZone),
  );
  await provider.save(planningContextExample);
  await planDay("Second", provider, planner);
  assert.deepEqual(inputs[1], {
    context: "Second",
    planningDate: "2026-10-22",
    planningContext: planningContextExample,
  });
  await provider.save(createEmptyPlanningContext("UTC"));
  await planDay("Third", provider, planner);
  assert.deepEqual(
    inputs[2].planningContext,
    createEmptyPlanningContext("UTC"),
  );
});

test("load failures prevent planner calls; planner failures propagate", async () => {
  const failure = new Error("Cannot load context");
  await assert.rejects(
    planDay(
      "Text",
      {
        async load() {
          throw failure;
        },
      },
      {
        async plan() {
          assert.fail("Planner must not run after a load failure");
        },
      },
    ),
    failure,
  );
  const plannerFailure = new Error("Cannot plan");
  await assert.rejects(
    planDay(
      "Text",
      {
        async load() {
          return planningContextExample;
        },
      },
      {
        async plan() {
          throw plannerFailure;
        },
      },
    ),
    plannerFailure,
  );
});

test("OpenAI receives all normalized fields without reading storage", async () => {
  const previous = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";
  try {
    const input = {
      context: "  Keep the evening free.  ",
      planningDate: "2026-10-22",
      planningContext: planningContextExample,
    };
    assert.equal(await new OpenAIDailyPlanner().plan(input), dailyPlanExample);
    assert.deepEqual(JSON.parse(openAIRequest.input), input);
  } finally {
    if (previous === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previous;
  }
});

test("API passes validated text and saved context to its planner", async () => {
  const input = {
    context: "  Keep my text.\n  ",
    planningDate: "2026-10-22",
    planningContext: planningContextExample,
  };
  const response = await POST(request(input));
  assert.equal(response.status, 200);
  assert.deepEqual(apiInputs.at(-1), input);
  assert.deepEqual(await response.json(), dailyPlanExample);
});

test("API rejects missing or invalid context and malformed JSON before planning", async () => {
  const before = apiInputs.length;
  for (const input of [
    null,
    { context: "Text" },
    {
      context: "   ",
      planningDate: "2026-10-22",
      planningContext: planningContextExample,
    },
    { context: "Text", planningDate: "2026-10-22", planningContext: null },
    {
      context: "Text",
      planningDate: "2026-10-22",
      planningContext: { ...planningContextExample, timeZone: "invalid" },
    },
    {
      context: "Text",
      planningDate: "2026-10-22",
      planningContext: {
        ...planningContextExample,
        routines: [
          { title: "Read", daysOfWeek: ["invalid"], durationMinutes: 10 },
        ],
      },
    },
  ]) {
    assert.equal((await POST(request(input))).status, 400);
  }
  assert.equal(
    (
      await POST(
        new Request("https://daily-os.test/api/plan", {
          method: "POST",
          body: "{",
        }),
      )
    ).status,
    400,
  );
  assert.equal(apiInputs.length, before);
});

test("API accepts an empty saved context and preserves service failure behavior", async () => {
  const input = {
    context: "Plan today",
    planningDate: "2026-10-22",
    planningContext: createEmptyPlanningContext("UTC"),
  };
  assert.equal((await POST(request(input))).status, 200);
  apiFailure = true;
  try {
    assert.equal((await POST(request(input))).status, 503);
  } finally {
    apiFailure = false;
  }
});

test("planningDate follows the saved time zone across midnight, years, and daylight saving", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 0 });
  for (const [instant, timeZone, expected] of [
    ["2026-01-01T00:30:00Z", "America/Los_Angeles", "2025-12-31"],
    ["2026-12-31T23:30:00Z", "Asia/Tokyo", "2027-01-01"],
    ["2026-03-29T23:30:00Z", "Europe/Lisbon", "2026-03-30"],
    ["2026-01-01T00:30:00Z", "UTC", "2026-01-01"],
  ]) {
    t.mock.timers.setTime(new Date(instant).getTime());
    await planDay(
      "Plan today",
      {
        async load() {
          return createEmptyPlanningContext(timeZone);
        },
      },
      {
        async plan(input) {
          assert.equal(input.planningDate, expected);
          assert.equal(input.planningContext.timeZone, timeZone);
          return dailyPlanExample;
        },
      },
    );
  }
});

test("API requires a real YYYY-MM-DD planningDate and accepts leap days", async () => {
  const before = apiInputs.length;
  for (const planningDate of [
    undefined,
    null,
    20261022,
    "",
    "2026-1-01",
    "22-10-2026",
    "2026-10-22T00:00:00Z",
    "2026-02-29",
    "2026-02-30",
    "2026-13-01",
  ]) {
    const response = await POST(
      request({
        context: "Plan today",
        planningDate,
        planningContext: planningContextExample,
      }),
    );
    assert.equal(
      response.status,
      400,
      `Unexpected acceptance of ${planningDate}`,
    );
  }
  assert.equal(apiInputs.length, before);
  const input = {
    context: "Plan today",
    planningDate: "2028-02-29",
    planningContext: planningContextExample,
  };
  assert.equal((await POST(request(input))).status, 200);
  assert.deepEqual(apiInputs.at(-1), input);
});
