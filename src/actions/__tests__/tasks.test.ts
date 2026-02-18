import fs from "fs";
import path from "path";
import os from "os";

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Task Server Actions", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-todo-actions-test-"));
    process.env.DB_PATH = path.join(tmpDir, "test.db");
    jest.resetModules();
    jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
  });

  afterEach(() => {
    try {
      const { closeDb } = require("@/lib/db");
      closeDb();
    } catch { /* ignore */ }
    fs.rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.DB_PATH;
  });

  it("should create a task", async () => {
    const { createTask } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const task = await createTask({ title: "New test task", priority: "high" });
    expect(task.title).toBe("New test task");
    expect(task.priority).toBe("high");
    expect(task.status).toBe("todo");
    expect(task.id).toBeDefined();
  });

  it("should create task with defaults", async () => {
    const { createTask } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const task = await createTask({ title: "Defaults" });
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
    expect(task.due_date).toBeNull();
  });

  it("should update a task", async () => {
    const { createTask, updateTask } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const created = await createTask({ title: "Update me" });
    const updated = await updateTask(created.id, { status: "done", priority: "low" });
    expect(updated.status).toBe("done");
    expect(updated.priority).toBe("low");
    expect(updated.title).toBe("Update me");
  });

  it("should throw for non-existent task update", async () => {
    const { updateTask } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    await expect(updateTask(99999, { title: "Nope" })).rejects.toThrow("not found");
  });

  it("should delete a task", async () => {
    const { createTask, deleteTask } = require("../tasks");
    const { getDb } = require("@/lib/db");
    const { seed } = require("@/lib/seed");
    seed();
    const created = await createTask({ title: "Delete me" });
    await deleteTask(created.id);
    const check = getDb().prepare("SELECT * FROM tasks WHERE id = ?").get(created.id);
    expect(check).toBeUndefined();
  });

  it("should get tasks with filters", async () => {
    const { getTasks } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const todoTasks = await getTasks({ status: "todo" });
    for (const task of todoTasks) {
      expect(task.status).toBe("todo");
    }
    expect(todoTasks.length).toBeGreaterThan(0);
  });

  it("should get tasks with search filter", async () => {
    const { getTasks } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const results = await getTasks({ search: "CI/CD" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("should get all tasks with no filters", async () => {
    const { getTasks } = require("../tasks");
    const { seed } = require("@/lib/seed");
    seed();
    const all = await getTasks({});
    expect(all).toHaveLength(14);
  });
});
