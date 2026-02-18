import { TASK_STATUSES, TASK_PRIORITIES } from "../types";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types";

describe("Types Module", () => {
  it("should export valid task statuses", () => {
    expect(TASK_STATUSES).toEqual(["todo", "in-progress", "done"]);
  });

  it("should export valid task priorities", () => {
    expect(TASK_PRIORITIES).toEqual(["high", "medium", "low"]);
  });

  it("should allow creating a valid Task object", () => {
    const task: Task = {
      id: 1,
      title: "Test task",
      description: "A description",
      status: "todo",
      priority: "high",
      due_date: "2026-03-01",
      created_at: "2026-02-18T12:00:00",
      updated_at: "2026-02-18T12:00:00",
    };
    expect(task.id).toBe(1);
    expect(task.status).toBe("todo");
  });

  it("should allow null description and due_date", () => {
    const task: Task = {
      id: 1,
      title: "Minimal",
      description: null,
      status: "todo",
      priority: "medium",
      due_date: null,
      created_at: "2026-02-18T12:00:00",
      updated_at: "2026-02-18T12:00:00",
    };
    expect(task.description).toBeNull();
    expect(task.due_date).toBeNull();
  });

  it("should define CreateTaskInput with optional fields", () => {
    const input: CreateTaskInput = { title: "New task" };
    expect(input.title).toBe("New task");
    expect(input.status).toBeUndefined();
  });

  it("should define UpdateTaskInput with all optional fields", () => {
    const input: UpdateTaskInput = { status: "done" };
    expect(input.status).toBe("done");
    expect(input.title).toBeUndefined();
  });
});
