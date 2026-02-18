# Solution: Database Setup

## Architecture Decision

### SQLite with better-sqlite3
Chose better-sqlite3 over alternatives (sql.js, drizzle ORM, prisma) for:
- **Synchronous API** — simpler code, no async overhead for a demo app
- **Native performance** — compiled C bindings via N-API
- **Zero config** — file-based, no server required
- **WAL mode** — enables concurrent reads without locking

### Singleton Pattern
Single database instance managed via module-level variable. Avoids "database is locked" errors and reduces connection overhead. Reset function exposed for testing only.

### Schema Design
- `CHECK` constraints enforce enum values at the database level (status, priority)
- ISO 8601 TEXT dates (SQLite has no native date type)
- Indexes on status, priority, due_date for efficient filtering
- `DEFAULT (datetime('now'))` for automatic timestamps

## Key Learnings

1. **`serverExternalPackages` is essential** — better-sqlite3 is a native module that can't be bundled by Next.js webpack. Must be in `next.config.ts`.
2. **`DB_PATH` via env var** — critical for testing (temp dirs) and deployment flexibility
3. **Directory auto-creation** — `fs.mkdirSync` with `recursive: true` prevents runtime errors on first access
4. **Seed idempotency** — checking count before insert prevents duplicate data on re-runs

## Patterns Established
- Feature KB structure: research → plan → implement → review → document
- TDD BATCH mode: write all tests, then implement
- Quality gates: lint + build + test must all pass before commit
- Conventional commits: `feat:`, `docs:`, `test:` prefixes

## Dependencies Added
- `better-sqlite3` ^11.x
- `@types/better-sqlite3` ^7.x
