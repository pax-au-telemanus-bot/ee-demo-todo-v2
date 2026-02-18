# AGENTS.md - ee-demo-todo

## Project Overview
A modern task management application built with Next.js 15, TypeScript, Tailwind CSS v4, and SQLite.

## Development Standards

### TDD (Test-Driven Development)
- **Tests first, always.** Write failing tests before implementation.
- Coverage target: ≥ 85%
- Use Jest + React Testing Library

### Conventional Commits
All commits must follow conventional commit format:
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring
- `chore:` — maintenance, deps
- `test:` — test additions/changes

### Branch Naming
- `feat/<feature-slug>` — new features
- `fix/<bug-slug>` — bug fixes
- `docs/<topic>` — documentation

### Quality Gates (before every commit)
1. `npm run build` — must pass
2. `npm run lint` — must pass
3. `npm test` — must pass
4. Coverage ≥ 85%

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI
- **Database:** SQLite via better-sqlite3
- **Fonts:** Local Geist fonts (NO Google Fonts)
- **Testing:** Jest + React Testing Library

### Architecture
- `/src/app/` — Next.js App Router pages
- `/src/lib/` — Shared utilities, database
- `/src/components/` — React components
- `/src/actions/` — Server Actions
- `/kb/repo/` — RPIRD workflow artifacts
