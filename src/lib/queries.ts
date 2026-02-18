import { getDb } from "./db";
import { seed } from "./seed";
import type { Task } from "./types";

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
}

export function getAllTasks(filters?: TaskFilters): Task[] {
  const db = getDb();
  seed();

  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (filters?.search) {
    conditions.push("(title LIKE @search OR description LIKE @search)");
    params.search = `%${filters.search}%`;
  }
  if (filters?.status && filters.status !== "all") {
    conditions.push("status = @status");
    params.status = filters.status;
  }
  if (filters?.priority && filters.priority !== "all") {
    conditions.push("priority = @priority");
    params.priority = filters.priority;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM tasks ${where} ORDER BY
    CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
    CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
    due_date ASC`;

  return db.prepare(sql).all(params) as Task[];
}

export function getTaskById(id: number): Task | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;
}

export function getTaskCounts(): { total: number; todo: number; inProgress: number; done: number } {
  const db = getDb();
  seed();
  const rows = db.prepare("SELECT status, COUNT(*) as count FROM tasks GROUP BY status").all() as { status: string; count: number }[];
  const counts = { total: 0, todo: 0, inProgress: 0, done: 0 };
  for (const row of rows) {
    counts.total += row.count;
    if (row.status === "todo") counts.todo = row.count;
    if (row.status === "in-progress") counts.inProgress = row.count;
    if (row.status === "done") counts.done = row.count;
  }
  return counts;
}
