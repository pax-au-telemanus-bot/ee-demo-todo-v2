# Research: Database Setup

## Metadata
- Feature: db-setup
- Date: 2026-02-18

## Context Provided
Setting up SQLite database with better-sqlite3 for a Next.js 15 todo application. Need tasks table with status (todo/in-progress/done), priority (high/medium/low), due dates, and 14 realistic seed tasks.

## Problem
The application needs a persistent data layer. SQLite with better-sqlite3 provides a zero-configuration, file-based database that's ideal for a demo app. Need to establish the schema, seed data, and database access patterns for use with Next.js Server Components and Server Actions.

## KB Findings

### Global (kb/global/)
- Engineering Excellence standards emphasize TDD, conventional commits, and quality gates
- QA standards recommend ≥85% coverage with meaningful tests
- Commit standards follow conventional commit format

### Local (kb/repo/)
- No prior features — this is the first feature in the repository
- No existing learnings to reference

### Learnings (kb/repo/learnings/)
- No promoted learnings yet

## Web

### better-sqlite3 with Next.js
- **Source**: npmjs.com/package/better-sqlite3, GitHub issues
- Must add `better-sqlite3` to `serverExternalPackages` in next.config.ts (native module)
- Use WAL mode (`PRAGMA journal_mode = WAL`) for better concurrent read performance
- Synchronous API — no async/await needed, simpler than alternatives
- Singleton pattern recommended to avoid "database is locked" errors
- Database file stored at project root or configurable path

### Schema Best Practices
- Use INTEGER PRIMARY KEY for auto-increment in SQLite
- TEXT type for dates (ISO 8601 format) — SQLite has no native date type
- CHECK constraints for enum-like columns (status, priority)
- DEFAULT CURRENT_TIMESTAMP for created_at/updated_at
- Indexes on frequently filtered columns (status, priority, due_date)

### Common Issues
- Native module bundling: must use `serverExternalPackages` config
- "Database is locked" in production: use singleton pattern + WAL mode
- Directory must exist before creating database file
- Only use in server-side code (Server Components, Server Actions, API routes)

## Codebase
- Next.js 15 project with App Router, TypeScript, Tailwind CSS v4
- `serverExternalPackages: ["better-sqlite3"]` already configured in next.config.ts
- No existing database code or models

## Constraints
- Server-side only — better-sqlite3 cannot run in browser
- SQLite file-based — single-server deployment only
- Must work with Next.js build process (no runtime issues)

## Dependencies
- better-sqlite3 (npm package + native bindings)
- @types/better-sqlite3 (TypeScript definitions)
