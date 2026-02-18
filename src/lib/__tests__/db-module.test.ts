import fs from "fs";
import path from "path";
import os from "os";

describe("DB Module (singleton)", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ee-todo-dbmod-test-"));
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

  it("should create database and schema on first access", () => {
    const { getDb } = require("../db");
    const db = getDb();
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").all();
    expect(tables).toHaveLength(1);
  });

  it("should return singleton instance", () => {
    const { getDb } = require("../db");
    expect(getDb()).toBe(getDb());
  });

  it("should use WAL journal mode", () => {
    const { getDb } = require("../db");
    const result = getDb().prepare("PRAGMA journal_mode").get() as { journal_mode: string };
    expect(result.journal_mode).toBe("wal");
  });

  it("should close and allow re-opening via resetDb", () => {
    const { getDb, closeDb, resetDb } = require("../db");
    getDb();
    closeDb();
    resetDb();
    jest.resetModules();
    process.env.DB_PATH = path.join(tmpDir, "test.db");
    const { getDb: getDb2 } = require("../db");
    const db2 = getDb2();
    const tables = db2.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'").all();
    expect(tables).toHaveLength(1);
  });

  it("should create data directory if it doesn't exist", () => {
    const { closeDb } = require("../db");
    closeDb();
    jest.resetModules();
    const nestedPath = path.join(tmpDir, "nested", "dir", "test.db");
    process.env.DB_PATH = nestedPath;
    const { getDb: getDb2 } = require("../db");
    getDb2();
    expect(fs.existsSync(path.dirname(nestedPath))).toBe(true);
  });
});
