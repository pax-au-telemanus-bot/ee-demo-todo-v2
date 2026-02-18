import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { Task } from "../types";

let db: Database.Database;
let dbPath: string;

function initSchema(database: Database.Database) {
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in-progress', 'done')),
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  database.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`);
  database.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`);
  database.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)`);
}

function getSeedTasks() {
  return [
    { title: "Design system architecture document", description: "Create comprehensive architecture decision records for the new microservices migration", status: "done" as const, priority: "high" as const, due_date: "2026-02-10" },
    { title: "Set up CI/CD pipeline", description: "Configure GitHub Actions with build, test, lint, and deploy stages", status: "done" as const, priority: "high" as const, due_date: "2026-02-12" },
    { title: "Implement user authentication", description: "Add OAuth 2.0 with Google and GitHub providers using NextAuth.js", status: "done" as const, priority: "high" as const, due_date: "2026-02-14" },
    { title: "Database schema migration", description: "Migrate from PostgreSQL to SQLite for local development simplicity", status: "done" as const, priority: "medium" as const, due_date: "2026-02-08" },
    { title: "Write API integration tests", description: "Cover all REST endpoints with integration tests using supertest", status: "in-progress" as const, priority: "high" as const, due_date: "2026-02-20" },
    { title: "Refactor dashboard components", description: "Break down monolithic dashboard into smaller, reusable components", status: "in-progress" as const, priority: "medium" as const, due_date: "2026-02-22" },
    { title: "Optimize database queries", description: "Add proper indexes and fix N+1 query issues in task listing", status: "in-progress" as const, priority: "high" as const, due_date: "2026-02-19" },
    { title: "Update project documentation", description: "Refresh README, API docs, and contributing guidelines", status: "in-progress" as const, priority: "low" as const, due_date: "2026-02-25" },
    { title: "Add dark mode support", description: "Implement system-aware dark/light theme toggle with Tailwind", status: "todo" as const, priority: "medium" as const, due_date: "2026-02-28" },
    { title: "Performance audit and optimization", description: "Run Lighthouse audit and optimize Core Web Vitals scores", status: "todo" as const, priority: "high" as const, due_date: "2026-03-01" },
    { title: "Mobile responsive redesign", description: "Redesign task views for optimal mobile and tablet experience", status: "todo" as const, priority: "medium" as const, due_date: "2026-03-05" },
    { title: "Add keyboard shortcuts", description: "Implement common keyboard shortcuts for power users (Cmd+K, etc.)", status: "todo" as const, priority: "low" as const, due_date: "2026-03-10" },
    { title: "Set up error monitoring", description: "Integrate Sentry for production error tracking and alerting", status: "todo" as const, priority: "medium" as const, due_date: "2026-03-03" },
    { title: "Accessibility compliance review", description: "Ensure WCAG 2.1 AA compliance across all interactive components", status: "todo" as const, priority: "high" as const, due_date: null },
  ];
}

beforeEach(() => {
  dbPath = path.join("/tmp", `test-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);
  db = new Database(dbPath);
  initSchema(db);
});

afterEach(() => {
  db.close();
  try { fs.unlinkSync(dbPath); } catch { /* ignore */ }
  try { fs.unlinkSync(dbPath + "-wal"); } catch { /* ignore */ }
  try { fs.unlinkSync(dbPath + "-shm"); } catch { /* ignore */ }
});

describe("Database Schema", () => {
  test("creates tasks table with correct columns", () => {
    const columns = db.pragma("table_info(tasks)") as Array<{ name: string }>;
    const columnNames = columns.map((c) => c.name);
    expect(columnNames).toEqual(["id", "title", "description", "status", "priority", "due_date", "created_at", "updated_at"]);
  });

  test("enforces status constraint", () => {
    expect(() => {
      db.prepare("INSERT INTO tasks (title, status) VALUES (?, ?)").run("Test", "invalid");
    }).toThrow();
  });

  test("enforces priority constraint", () => {
    expect(() => {
      db.prepare("INSERT INTO tasks (title, priority) VALUES (?, ?)").run("Test", "invalid");
    }).toThrow();
  });

  test("allows valid status values", () => {
    for (const status of ["todo", "in-progress", "done"]) {
      const result = db.prepare("INSERT INTO tasks (title, status) VALUES (?, ?)").run(`Task ${status}`, status);
      expect(result.changes).toBe(1);
    }
  });

  test("allows valid priority values", () => {
    for (const priority of ["high", "medium", "low"]) {
      const result = db.prepare("INSERT INTO tasks (title, priority) VALUES (?, ?)").run(`Task ${priority}`, priority);
      expect(result.changes).toBe(1);
    }
  });

  test("auto-generates id, created_at, updated_at with defaults", () => {
    db.prepare("INSERT INTO tasks (title) VALUES (?)").run("Test task");
    const task = db.prepare("SELECT * FROM tasks WHERE title = ?").get("Test task") as Task;
    expect(task.id).toBe(1);
    expect(task.created_at).toBeTruthy();
    expect(task.updated_at).toBeTruthy();
    expect(task.status).toBe("todo");
    expect(task.priority).toBe("medium");
  });

  test("creates indexes on status, priority, due_date", () => {
    const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='tasks'").all() as Array<{ name: string }>;
    const indexNames = indexes.map((i) => i.name);
    expect(indexNames).toContain("idx_tasks_status");
    expect(indexNames).toContain("idx_tasks_priority");
    expect(indexNames).toContain("idx_tasks_due_date");
  });
});

describe("Seed Data", () => {
  test("inserts 14 seed tasks", () => {
    const seedTasks = getSeedTasks();
    const insert = db.prepare(
      "INSERT INTO tasks (title, description, status, priority, due_date) VALUES (@title, @description, @status, @priority, @due_date)"
    );
    const insertMany = db.transaction((tasks: typeof seedTasks) => {
      for (const task of tasks) insert.run(task);
    });
    insertMany(seedTasks);

    const count = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number };
    expect(count.count).toBe(14);
  });

  test("seed tasks cover all statuses", () => {
    const seedTasks = getSeedTasks();
    const statuses = new Set(seedTasks.map((t) => t.status));
    expect(statuses).toEqual(new Set(["todo", "in-progress", "done"]));
  });

  test("seed tasks cover all priorities", () => {
    const seedTasks = getSeedTasks();
    const priorities = new Set(seedTasks.map((t) => t.priority));
    expect(priorities).toEqual(new Set(["high", "medium", "low"]));
  });

  test("seed tasks have varied due dates", () => {
    const seedTasks = getSeedTasks();
    const withDates = seedTasks.filter((t) => t.due_date !== null);
    expect(withDates.length).toBeGreaterThanOrEqual(10);
  });
});
