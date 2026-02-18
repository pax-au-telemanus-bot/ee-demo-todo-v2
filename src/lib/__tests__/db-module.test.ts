import fs from "fs";
import path from "path";

const testDbPath = path.join("/tmp", `module-test-${Date.now()}.db`);

// Override DB_PATH before importing
jest.mock("path", () => {
  const actual = jest.requireActual("path");
  return {
    ...actual,
    join: (...args: string[]) => {
      if (args.length === 2 && args[1] === "todo.db") return testDbPath;
      return actual.join(...args);
    },
  };
});

afterAll(() => {
  const { closeDb } = require("../db");
  closeDb();
  try { fs.unlinkSync(testDbPath); } catch { /* ignore */ }
  try { fs.unlinkSync(testDbPath + "-wal"); } catch { /* ignore */ }
  try { fs.unlinkSync(testDbPath + "-shm"); } catch { /* ignore */ }
});

describe("Database Module", () => {
  test("getDb creates database and schema", () => {
    const { getDb } = require("../db");
    const db = getDb();
    expect(db).toBeDefined();

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").all();
    expect(tables).toHaveLength(1);
  });

  test("getDb returns singleton", () => {
    const { getDb } = require("../db");
    const db1 = getDb();
    const db2 = getDb();
    expect(db1).toBe(db2);
  });

  test("closeDb closes the connection", () => {
    const { getDb, closeDb } = require("../db");
    getDb();
    closeDb();
    // After close, getDb should create a new instance
    const db2 = getDb();
    expect(db2).toBeDefined();
  });
});

describe("Seed Module", () => {
  test("seed populates 14 tasks", () => {
    const { getDb } = require("../db");
    const { seed } = require("../seed");
    // Clear any existing tasks
    const db = getDb();
    db.exec("DELETE FROM tasks");

    seed();
    const count = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number };
    expect(count.count).toBe(14);
  });

  test("seed is idempotent", () => {
    const { getDb } = require("../db");
    const { seed } = require("../seed");
    const db = getDb();

    // Already seeded from previous test
    const countBefore = (db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number }).count;
    seed(); // Should not add more
    const countAfter = (db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number }).count;
    expect(countAfter).toBe(countBefore);
  });
});
