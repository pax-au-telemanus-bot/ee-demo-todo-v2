# Plan: Server Actions & List View

## Metadata
- Feature: server-actions-list
- Date: 2026-02-18
- Detail Level: STANDARD

## Problem Statement
Users need to view, create, edit, and delete tasks through a polished UI. The database exists but there's no interface to interact with it.

## User Stories

### Epic: Task Management UI

#### Story 1: CRUD Server Actions
**As a** user
**I want** to create, read, update, and delete tasks
**So that** I can manage my work

Acceptance Criteria:
- [ ] Given valid input, when creating a task, then it's persisted and the list refreshes
- [ ] Given a task exists, when updating it, then changes are saved
- [ ] Given a task exists, when deleting it, then it's removed

#### Story 2: Task List View
**As a** user
**I want** to see all tasks in a polished table/list
**So that** I can overview my work at a glance

Acceptance Criteria:
- [ ] Given tasks exist, when viewing the page, then all tasks display with status badges and priority indicators
- [ ] Given the list view, when viewing a task, then I see title, description, status, priority, and due date

#### Story 3: Filters
**As a** user
**I want** to filter tasks by status, priority, due date range, and text search
**So that** I can find specific tasks quickly

Acceptance Criteria:
- [ ] Given tasks exist, when filtering by status, then only matching tasks show
- [ ] Given tasks exist, when searching by text, then matching titles/descriptions show
- [ ] Given tasks exist, when filtering by priority, then only matching tasks show

## Approach
1. Set up Shadcn UI with required components
2. Create Server Actions for CRUD in src/actions/tasks.ts
3. Build TaskList client component with filters
4. Build Create/Edit task dialog
5. Wire everything together on the main page

## Tasks

### Phase 1: Shadcn Setup & Server Actions
| # | Task | Story | Estimate | Notes |
|---|------|-------|----------|-------|
| 1 | Initialize Shadcn UI | All | S | npx shadcn init |
| 2 | Add required components | All | S | button, table, input, select, badge, dialog, textarea |
| 3 | Create CRUD server actions | Story 1 | M | getTasks, createTask, updateTask, deleteTask |

### Phase 2: UI Components
| # | Task | Story | Estimate | Notes |
|---|------|-------|----------|-------|
| 4 | TaskList component with table | Story 2 | M | Polished table with badges |
| 5 | Filter bar component | Story 3 | M | Status, priority, date range, search |
| 6 | Create/Edit task dialog | Story 1 | M | Form with validation |
| 7 | Main page integration | All | S | Wire components together |

## Acceptance Criteria (Feature-Level)
- [ ] All CRUD operations working
- [ ] Polished Apple-quality UI
- [ ] Filters working for status, priority, date, text
- [ ] Test coverage ≥ 85%

## Test Strategy
- **Unit**: Server actions (CRUD operations), filter logic
- **Integration**: Full CRUD flow with database
- **Coverage target**: 85%

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shadcn + Tailwind v4 compatibility | M | M | Use latest shadcn with v4 support |

## Out of Scope
- Kanban view (Phase 3)
- Calendar view (Phase 3)
- Drag and drop (Phase 3)
