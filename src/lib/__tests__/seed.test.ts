import fs from "fs";
import path from "path";
import os from "os";

describe("Seed Module", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-todo-seed-test-"));
    process.env.DB_PATH = path.join(tmpDir, "test.db");
    jest.resetModules();
  });

  afterEach(() => {
    try {
      const { closeDb } = require("../db");
      closeDb();
    } catch { /* ignore */ }
    fs.rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.DB_PATH;
  });

  it("should seed 14 tasks into empty database", () => {
    const { seed } = require("../seed");
    const result = seed();
    expect(result).toBe(14);
  });

  it("should not re-seed if tasks already exist", () => {
    const { seed } = require("../seed");
    const { getDb } = require("../db");
    seed();
    const count1 = (getDb().prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number }).count;
    const result2 = seed();
    expect(count1).toBe(14);
    expect(result2).toBe(14);
  });

  it("should have tasks across all statuses", () => {
    const { seed } = require("../seed");
    const { getDb } = require("../db");
    seed();
    const statuses = getDb().prepare("SELECT DISTINCT status FROM tasks ORDER BY status").all() as { status: string }[];
    expect(statuses.map((s) => s.status).sort()).toEqual(["done", "in-progress", "todo"]);
  });

  it("should have tasks across all priorities", () => {
    const { seed } = require("../seed");
    const { getDb } = require("../db");
    seed();
    const priorities = getDb().prepare("SELECT DISTINCT priority FROM tasks ORDER BY priority").all() as { priority: string }[];
    expect(priorities.map((p) => p.priority).sort()).toEqual(["high", "low", "medium"]);
  });

  it("should have realistic data with titles and descriptions", () => {
    const { seed } = require("../seed");
    const { getDb } = require("../db");
    seed();
    const tasks = getDb().prepare("SELECT * FROM tasks").all() as any[];
    for (const task of tasks) {
      expect(task.title.length).toBeGreaterThan(5);
      expect(task.description.length).toBeGreaterThan(10);
    }
  });

  it("should export SEED_TASKS constant with 14 entries", () => {
    const { SEED_TASKS } = require("../seed");
    expect(SEED_TASKS).toHaveLength(14);
  });
});
