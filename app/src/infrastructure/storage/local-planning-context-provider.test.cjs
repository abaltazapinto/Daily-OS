// Run with: node --test src/infrastructure/storage/local-planning-context-provider.test.cjs
// Use the existing TypeScript compiler without introducing a test framework.
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
  createEmptyPlanningContext,
} = require("../../application/planning-context/create-empty-planning-context.ts");
const {
  planningContextExample,
} = require("../../domain/planning-context/planning-context.example.ts");
const {
  LocalPlanningContextProvider,
} = require("./local-planning-context-provider.ts");

function createStorage() {
  const values = new Map();
  return {
    values,
    async getItem(key) {
      return values.get(key) ?? null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
  };
}

test("missing storage returns fresh empty contexts without writing", async () => {
  const storage = createStorage();
  const provider = new LocalPlanningContextProvider(storage);
  const first = await provider.load();
  assert.deepEqual(first, createEmptyPlanningContext(first.timeZone));
  assert.ok(first.timeZone);
  first.preferences.breakDurationMinutes = 10;
  first.routines.push({
    title: "Reading",
    daysOfWeek: ["monday"],
    durationMinutes: 20,
  });
  assert.deepEqual(
    await provider.load(),
    createEmptyPlanningContext(first.timeZone),
  );
  assert.equal(storage.values.size, 0);
});

test("contexts survive new provider instances and saves replace all data", async () => {
  const storage = createStorage();
  await new LocalPlanningContextProvider(storage).save(planningContextExample);
  const reloaded = await new LocalPlanningContextProvider(storage).load();
  assert.deepEqual(reloaded, planningContextExample);
  const replacement = createEmptyPlanningContext("UTC");
  await new LocalPlanningContextProvider(storage).save(replacement);
  assert.deepEqual(
    await new LocalPlanningContextProvider(storage).load(),
    replacement,
  );
  assert.equal(storage.values.size, 1);
});

test("malformed JSON and invalid stored shapes reject without overwriting", async () => {
  const storage = createStorage();
  const provider = new LocalPlanningContextProvider(storage);
  await provider.save(planningContextExample);
  const key = [...storage.values.keys()][0];
  for (const invalid of [
    "{",
    "null",
    "{}",
    JSON.stringify({
      ...planningContextExample,
      routines: [
        { title: "Run", daysOfWeek: ["not-a-day"], durationMinutes: -1 },
      ],
    }),
  ]) {
    storage.values.set(key, invalid);
    await assert.rejects(provider.load());
    assert.equal(storage.values.get(key), invalid);
  }
});

test("invalid saves preserve previously stored data", async () => {
  const storage = createStorage();
  const provider = new LocalPlanningContextProvider(storage);
  await provider.save(planningContextExample);
  await assert.rejects(
    provider.save({ ...planningContextExample, timeZone: "invalid-zone" }),
  );
  await assert.rejects(
    provider.save({
      ...planningContextExample,
      preferences: { breakDurationMinutes: -1 },
    }),
  );
  assert.deepEqual(await provider.load(), planningContextExample);
});

test("storage read and write failures are propagated", async () => {
  const failure = new Error("Storage unavailable");
  const provider = new LocalPlanningContextProvider({
    async getItem() {
      throw failure;
    },
    async setItem() {
      throw failure;
    },
  });
  await assert.rejects(provider.load(), failure);
  await assert.rejects(provider.save(planningContextExample), failure);
});
