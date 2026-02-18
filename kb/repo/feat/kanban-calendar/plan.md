# Plan: Kanban & Calendar Views

## Metadata
- Feature: kanban-calendar
- Date: 2026-02-18
- Detail Level: STANDARD

## Problem Statement
Users need multiple visualization modes for tasks. The list view works but doesn't show workflow status at a glance or time-based task distribution.

## User Stories

### Epic: Multi-View Task Management

#### Story 1: Kanban Board
**As a** user
**I want** to see tasks in columns by status and drag between them
**So that** I can quickly update task workflow

Acceptance Criteria:
- [ ] Given tasks exist, when viewing Kanban, then tasks appear in todo/in-progress/done columns
- [ ] Given a task in "todo", when dragged to "in-progress", then status updates in database

#### Story 2: Calendar View
**As a** user
**I want** to see tasks on a calendar by due date
**So that** I can plan my time

Acceptance Criteria:
- [ ] Given tasks with due dates, when viewing calendar, then they appear on correct dates
- [ ] Given the calendar, when navigating months, then tasks update accordingly

#### Story 3: Tabbed Navigation
**As a** user
**I want** to switch between List, Kanban, and Calendar views
**So that** I can use the best view for my current need

Acceptance Criteria:
- [ ] Given any view, when switching tabs, then the view changes instantly
- [ ] Given a change in one view, when switching to another, then updates reflect

## Tasks

### Phase 1: Dependencies & Tabs
| # | Task | Estimate | Notes |
|---|------|----------|-------|
| 1 | Install @dnd-kit, react-big-calendar, date-fns | S | |
| 2 | Add Shadcn Tabs component | S | |
| 3 | Restructure page with Tabs | S | |

### Phase 2: Kanban Board
| # | Task | Estimate | Notes |
|---|------|----------|-------|
| 4 | KanbanBoard component | M | DndContext with 3 columns |
| 5 | KanbanCard component | S | Draggable task card |
| 6 | Drag-and-drop status update | M | updateTask on drop |

### Phase 3: Calendar View
| # | Task | Estimate | Notes |
|---|------|----------|-------|
| 7 | CalendarView component | M | react-big-calendar integration |
| 8 | Event mapping from tasks | S | tasks → calendar events |

## Test Strategy
- **Unit**: Kanban column grouping, calendar event mapping
- **Integration**: Drag-and-drop status change persists
- **Coverage target**: 85%

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| react-big-calendar CSS conflicts with Tailwind | M | M | Custom CSS overrides |
| @dnd-kit complexity | L | M | Follow established patterns |

## Out of Scope
- Task reordering within columns
- Calendar event creation by clicking dates
