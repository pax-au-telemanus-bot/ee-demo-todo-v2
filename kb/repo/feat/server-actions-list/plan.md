# Plan: Server Actions & List View

## Metadata
- Feature: server-actions-list
- Date: 2026-02-18
- Detail Level: STANDARD

## Problem Statement
Users need to view, create, edit, and delete tasks through a polished UI. The database layer exists but there's no interaction layer or visual interface.

- Who: All users of the demo app
- Current: Database with seed data, placeholder page
- Desired: Full CRUD via Server Actions, polished list view with filters
- Impact: Core application functionality

## User Stories

### Epic: Task CRUD Operations

#### Story 1: View Tasks
**As a** user
**I want** to see all tasks in a organized list
**So that** I can understand what needs to be done

Acceptance Criteria:
- [ ] Tasks displayed in a table with title, status, priority, due date
- [ ] Status shown as colored badges (todo=gray, in-progress=blue, done=green)
- [ ] Priority shown as colored badges (high=red, medium=yellow, low=gray)
- [ ] Due dates formatted human-readable, overdue dates highlighted

#### Story 2: Filter Tasks
**As a** user
**I want** to filter tasks by status, priority, and search text
**So that** I can find specific tasks quickly

Acceptance Criteria:
- [ ] Text search filters by title and description
- [ ] Status dropdown filters by todo/in-progress/done/all
- [ ] Priority dropdown filters by high/medium/low/all
- [ ] Filters work in combination
- [ ] URL reflects filter state (query params)

#### Story 3: Create Tasks
**As a** user
**I want** to create new tasks
**So that** I can track new work

Acceptance Criteria:
- [ ] "New Task" button opens a dialog/modal
- [ ] Form fields: title (required), description, status, priority, due date
- [ ] Validation: title required, min 2 chars
- [ ] After creation, list refreshes showing new task

#### Story 4: Edit Tasks
**As a** user
**I want** to edit existing tasks
**So that** I can update task details

Acceptance Criteria:
- [ ] Click task row or edit button opens edit dialog
- [ ] Pre-populated form with current values
- [ ] After save, list refreshes with updated data

#### Story 5: Delete Tasks
**As a** user
**I want** to delete tasks
**So that** I can remove completed or irrelevant work

Acceptance Criteria:
- [ ] Delete button on each task with confirmation
- [ ] After deletion, list refreshes

## Approach
1. Initialize Shadcn UI
2. Create Server Actions (CRUD) in src/actions/tasks.ts
3. Create task queries in src/lib/queries.ts (server-side data fetching)
4. Build list view components (TaskTable, TaskFilters, TaskDialog)
5. Wire up with revalidatePath for live updates

## Tasks

### Phase 1: Setup & Data Layer (S)
| # | Task | Estimate |
|---|------|----------|
| 1 | Initialize Shadcn UI | S |
| 2 | Create queries module (getAllTasks, getTaskById) | S |
| 3 | Create Server Actions (create, update, delete) | S |

### Phase 2: List View UI (M)
| # | Task | Estimate |
|---|------|----------|
| 4 | Install Shadcn components (table, button, input, select, badge, dialog) | S |
| 5 | Build TaskTable component | M |
| 6 | Build TaskFilters component | M |
| 7 | Build TaskDialog (create/edit) component | M |
| 8 | Build DeleteConfirmation component | S |
| 9 | Wire up page.tsx with all components | S |

## Test Strategy
- **Unit**: Server Actions (create/update/delete), queries
- **Integration**: Full CRUD flow via actions
- **Component**: TaskTable rendering, filter behavior (if jest-dom configured for RSC)

## Risks
- Shadcn init may need manual configuration for Tailwind v4
- Server Actions testing requires mocking revalidatePath
- Client/server component boundary management
