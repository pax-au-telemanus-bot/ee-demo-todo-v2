# Plan: Database Setup

## Metadata
- Feature: db-setup
- Date: 2026-02-18
- Detail Level: STANDARD

## Problem Statement
The todo application needs a persistent data layer to store and retrieve tasks. Currently there is no database. We need a SQLite database with a well-defined schema, type-safe access layer, and realistic seed data.

- Who is affected? All application users and downstream features (CRUD, views)
- Current state: No database, no data model
- Desired state: SQLite database with tasks table, typed access layer, 14 seed tasks
- Business impact: Foundation for all app functionality

## User Stories

### Epic: Database Setup

#### Story 1: Database Schema
**As a** developer
**I want** a well-defined tasks table with proper constraints
**So that** data integrity is maintained

Acceptance Criteria:
- [ ] Given the app starts, when the database doesn't exist, then it creates the schema automatically
- [ ] Given a task is inserted, when status is not todo/in-progress/done, then it is rejected
- [ ] Given a task is inserted, when priority is not high/medium/low, then it is rejected

#### Story 2: Database Access Layer
**As a** developer
**I want** a type-safe database module with singleton pattern
**So that** I can safely query tasks from Server Components and Server Actions

Acceptance Criteria:
- [ ] Given multiple imports, when accessing the database, then the same instance is returned
- [ ] Given WAL mode, when concurrent reads occur, then no locking errors

#### Story 3: Seed Data
**As a** user
**I want** the app pre-populated with realistic tasks
**So that** the demo looks populated and functional

Acceptance Criteria:
- [ ] Given a fresh database, when seeded, then 14 tasks exist across all statuses and priorities
- [ ] Given seed tasks, when viewed, then they have realistic titles, descriptions, and due dates

## Approach
- Install better-sqlite3 and @types/better-sqlite3
- Create singleton database module at `src/lib/db.ts`
- Define TypeScript types for Task model at `src/lib/types.ts`
- Create schema initialization with CREATE TABLE IF NOT EXISTS
- Add seed function with 14 realistic tasks
- Use WAL mode and proper indexes

## Tasks

### Phase 1: Types and Database Module
| # | Task | Story | Estimate | Notes |
|---|------|-------|----------|-------|
| 1 | Define Task TypeScript types | Story 1, 2 | S | types.ts |
| 2 | Create singleton DB module | Story 2 | S | db.ts with WAL mode |
| 3 | Create schema initialization | Story 1 | S | CREATE TABLE with constraints |

### Phase 2: Seed Data
| # | Task | Story | Estimate | Notes |
|---|------|-------|----------|-------|
| 4 | Create seed function | Story 3 | M | 14 realistic tasks |
| 5 | Add seed script | Story 3 | S | npm run seed |

## Acceptance Criteria (Feature-Level)
- [ ] All user stories complete
- [ ] Test coverage ≥ 85%
- [ ] No critical/high bugs
- [ ] Database initializes automatically on first access
- [ ] 14 seed tasks with varied statuses, priorities, and dates

## Test Strategy
- **Unit**: Database initialization, schema creation, seed function, type validation
- **Integration**: Full database lifecycle (create → seed → query → close)
- **Coverage target**: 85%

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Native module build issues | M | H | serverExternalPackages configured |
| Database locked errors | L | M | Singleton pattern + WAL mode |

## Dependencies
| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| better-sqlite3 | Blocking | Pending install | Developer |
| @types/better-sqlite3 | Blocking | Pending install | Developer |

## Out of Scope
- CRUD operations (Phase 2)
- UI components (Phase 2)
- Migrations system (not needed for demo)

## Open Questions
- None
