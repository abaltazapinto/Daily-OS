// Run with: node src/presentation/planning-context/planning-context-draft.test.cjs
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
const {
  createPlanningContextDraft,
  planningContextFromDraft,
} = require("./planning-context-draft.ts");
const {
  createEmptyPlanningContext,
} = require("../../application/planning-context/create-empty-planning-context.ts");
const {
  LocalPlanningContextProvider,
} = require("../../infrastructure/storage/local-planning-context-provider.ts");
const { planDay } = require("../../application/planning/plan-day.ts");

const context = {
  timeZone: "Europe/Lisbon",
  recurringCommitments: [
    {
      title: "Language class",
      daysOfWeek: ["tuesday"],
      startTime: "18:00",
      endTime: "19:00",
      location: "Learning centre",
    },
    {
      title: "Volunteering",
      daysOfWeek: ["saturday"],
      startTime: "10:00",
      endTime: "11:00",
    },
  ],
  routines: [
    { title: "Reading", daysOfWeek: ["monday"], durationMinutes: 20 },
    {
      title: "Walking",
      daysOfWeek: ["friday"],
      durationMinutes: 30,
      preferredStartTime: "08:00",
    },
  ],
  travelTimes: [
    { from: "Home", to: "Learning centre", mode: "walk", durationMinutes: 15 },
    {
      from: "Learning centre",
      to: "Home",
      mode: "public_transport",
      durationMinutes: 10,
    },
  ],
  preferences: {
    preferredFocusDurationMinutes: 50,
    breakDurationMinutes: 0,
    defaultTransitionBufferMinutes: 5,
  },
};

function provider() {
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

test("existing and empty contexts round trip with optional fields and zero preferences intact", () => {
  assert.deepEqual(
    planningContextFromDraft(createPlanningContextDraft(context)),
    context,
  );
  const empty = createEmptyPlanningContext("UTC");
  assert.deepEqual(
    planningContextFromDraft(createPlanningContextDraft(empty)),
    empty,
  );
});

test("draft edits are isolated from loaded context, including weekday arrays", () => {
  const original = structuredClone(context);
  const draft = createPlanningContextDraft(original);
  draft.recurringCommitments[0].title = "Changed";
  draft.recurringCommitments[0].daysOfWeek.push("wednesday");
  draft.routines[0].daysOfWeek.length = 0;
  draft.travelTimes[0].durationMinutes = "999";
  draft.preferences.breakDurationMinutes = "20";
  assert.deepEqual(original, context);
});

test("blank optional fields are omitted and required text is trimmed", () => {
  const draft = createPlanningContextDraft(context);
  draft.recurringCommitments[0].title = "  Class  ";
  draft.recurringCommitments[0].location = " ";
  draft.routines[1].preferredStartTime = " ";
  draft.preferences.breakDurationMinutes = " ";
  const saved = planningContextFromDraft(draft);
  assert.equal(saved.recurringCommitments[0].title, "Class");
  assert.equal("location" in saved.recurringCommitments[0], false);
  assert.equal("preferredStartTime" in saved.routines[1], false);
  assert.equal("breakDurationMinutes" in saved.preferences, false);
});

test("incomplete and invalid entries produce field-specific feedback", () => {
  for (const [edit, message] of [
    [
      (draft) => {
        draft.timeZone = "invalid-zone";
      },
      /Time zone/,
    ],
    [
      (draft) => {
        draft.recurringCommitments[0].title = " ";
      },
      /Commitment 1 title/,
    ],
    [
      (draft) => {
        draft.recurringCommitments[0].daysOfWeek = [];
      },
      /Commitment 1.*day/,
    ],
    [
      (draft) => {
        draft.recurringCommitments[0].startTime = "24:00";
      },
      /start time/,
    ],
    [
      (draft) => {
        draft.recurringCommitments[0].endTime = "9:00";
      },
      /end time/,
    ],
    [
      (draft) => {
        draft.routines[0].durationMinutes = "";
      },
      /Routine 1 duration/,
    ],
    [
      (draft) => {
        draft.routines[0].durationMinutes = "0";
      },
      /Routine 1 duration/,
    ],
    [
      (draft) => {
        draft.routines[0].preferredStartTime = "08:99";
      },
      /preferred start/,
    ],
    [
      (draft) => {
        draft.travelTimes[0].from = "";
      },
      /from/,
    ],
    [
      (draft) => {
        draft.travelTimes[0].to = "";
      },
      /to/,
    ],
    [
      (draft) => {
        draft.travelTimes[0].durationMinutes = "Infinity";
      },
      /duration/,
    ],
    [
      (draft) => {
        draft.preferences.preferredFocusDurationMinutes = "0";
      },
      /focus duration/,
    ],
    [
      (draft) => {
        draft.preferences.breakDurationMinutes = "-1";
      },
      /Break duration/,
    ],
    [
      (draft) => {
        draft.preferences.defaultTransitionBufferMinutes = "abc";
      },
      /Transition buffer/,
    ],
  ]) {
    const draft = createPlanningContextDraft(context);
    edit(draft);
    assert.throws(() => planningContextFromDraft(draft), message);
  }
});

test("add, edit, remove and directional travel changes persist through the provider and reach planning", async () => {
  const storage = provider();
  await storage.save(context);
  const draft = createPlanningContextDraft(await storage.load());
  draft.recurringCommitments.splice(1, 1);
  draft.recurringCommitments[0].endTime = "19:30";
  draft.recurringCommitments.push({
    title: "Community group",
    daysOfWeek: ["sunday"],
    startTime: "15:00",
    endTime: "16:00",
    location: "",
  });
  draft.routines.splice(0, 1);
  draft.routines[0].durationMinutes = "40";
  draft.travelTimes[0].durationMinutes = "25";
  draft.preferences.defaultTransitionBufferMinutes = "0";
  const expected = planningContextFromDraft(draft);
  // Until Save, persisted data is untouched.
  assert.deepEqual(await storage.load(), context);
  await storage.save(expected);
  assert.deepEqual(await storage.load(), expected);
  assert.equal(expected.travelTimes[1].durationMinutes, 10);
  await planDay("Plan today", storage, {
    async plan(input) {
      assert.deepEqual(input.planningContext, expected);
      return null;
    },
  });
});

test("invalid draft never overwrites persisted data and failed saves retain the draft for retry", async () => {
  const storage = provider();
  await storage.save(context);
  const draft = createPlanningContextDraft(await storage.load());
  draft.routines[0].durationMinutes = "bad";
  await assert.rejects(async () =>
    storage.save(planningContextFromDraft(draft)),
  );
  assert.deepEqual(await storage.load(), context);
  draft.routines[0].durationMinutes = "35";
  const snapshot = structuredClone(draft);
  const failure = new Error("Storage unavailable");
  await assert.rejects(async () => {
    const failing = {
      async save() {
        throw failure;
      },
    };
    await failing.save(planningContextFromDraft(draft));
  }, failure);
  assert.deepEqual(draft, snapshot);
  await storage.save(planningContextFromDraft(draft));
  assert.equal((await storage.load()).routines[0].durationMinutes, 35);
});
