import fs from "fs";
import path from "path";
import os from "os";

describe("Queries Module", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-todo-queries-test-"));
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

  it("should return all tasks with seed data", () => {
    const { getAllTasks } = require("../queries");
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(14);
  });

  it("should filter by status", () => {
    const { getAllTasks } = require("../queries");
    const todoTasks = getAllTasks({ status: "todo" });
    for (const task of todoTasks) {
      expect(task.status).toBe("todo");
    }
    expect(todoTasks.length).toBeGreaterThan(0);
  });

  it("should filter by priority", () => {
    const { getAllTasks } = require("../queries");
    const highTasks = getAllTasks({ priority: "high" });
    for (const task of highTasks) {
      expect(task.priority).toBe("high");
    }
    expect(highTasks.length).toBeGreaterThan(0);
  });

  it("should filter by search text", () => {
    const { getAllTasks } = require("../queries");
    const results = getAllTasks({ search: "CI/CD" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("CI/CD");
  });

  it("should combine filters", () => {
    const { getAllTasks } = require("../queries");
    const results = getAllTasks({ status: "todo", priority: "high" });
    for (const task of results) {
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("high");
    }
  });

  it("should return all when status is 'all'", () => {
    const { getAllTasks } = require("../queries");
    const all = getAllTasks({ status: "all" });
    expect(all).toHaveLength(14);
  });

  it("should get task by id", () => {
    const { getAllTasks, getTaskById } = require("../queries");
    const tasks = getAllTasks();
    const task = getTaskById(tasks[0].id);
    expect(task).toBeDefined();
    expect(task!.id).toBe(tasks[0].id);
  });

  it("should return undefined for non-existent id", () => {
    const { getTaskById } = require("../queries");
    const { seed } = require("../seed");
    seed();
    expect(getTaskById(99999)).toBeUndefined();
  });

  it("should get task counts", () => {
    const { getTaskCounts } = require("../queries");
    const counts = getTaskCounts();
    expect(counts.total).toBe(14);
    expect(counts.todo + counts.inProgress + counts.done).toBe(14);
  });
});
