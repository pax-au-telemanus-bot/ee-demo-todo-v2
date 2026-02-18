"use server";

import { getDb } from "@/lib/db";
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export async function getTasks(filters: TaskFilters): Promise<Task[]> {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters.status) {
    conditions.push("status = @status");
    params.status = filters.status;
  }

  if (filters.priority) {
    conditions.push("priority = @priority");
    params.priority = filters.priority;
  }

  if (filters.search) {
    conditions.push("(title LIKE @search OR description LIKE @search)");
    params.search = `%${filters.search}%`;
  }

  if (filters.dueDateFrom) {
    conditions.push("due_date >= @dueDateFrom");
    params.dueDateFrom = filters.dueDateFrom;
  }

  if (filters.dueDateTo) {
    conditions.push("due_date <= @dueDateTo");
    params.dueDateTo = filters.dueDateTo;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM tasks ${where} ORDER BY
    CASE status WHEN 'in-progress' THEN 0 WHEN 'todo' THEN 1 WHEN 'done' THEN 2 END,
    CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END,
    due_date ASC NULLS LAST`;

  return db.prepare(sql).all(params) as Task[];
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO tasks (title, description, status, priority, due_date)
     VALUES (@title, @description, @status, @priority, @due_date)`
  ).run({
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? "todo",
    priority: input.priority ?? "medium",
    due_date: input.due_date ?? null,
  });

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid) as Task;
  revalidatePath("/");
  return task;
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task;
  if (!existing) throw new Error(`Task ${id} not found`);

  db.prepare(
    `UPDATE tasks SET
      title = @title,
      description = @description,
      status = @status,
      priority = @priority,
      due_date = @due_date,
      updated_at = datetime('now')
    WHERE id = @id`
  ).run({
    id,
    title: input.title ?? existing.title,
    description: input.description !== undefined ? input.description : existing.description,
    status: input.status ?? existing.status,
    priority: input.priority ?? existing.priority,
    due_date: input.due_date !== undefined ? input.due_date : existing.due_date,
  });

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task;
  revalidatePath("/");
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  const db = getDb();
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  revalidatePath("/");
}
