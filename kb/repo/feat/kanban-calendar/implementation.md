# Implementation: Kanban & Calendar Views

## Metadata
- Feature: kanban-calendar
- Date: 2026-02-18
- TDD Mode: BATCH

## Changes Made

### New Components
1. **KanbanBoard** (`src/components/kanban-board.tsx`)
   - Three-column layout: Todo, In Progress, Done
   - Drag-and-drop via @dnd-kit/core with `useDraggable` and `useDroppable`
   - Optimistic status updates on drag end
   - Visual feedback: column highlighting on hover, card rotation during drag
   - Priority badges and due date display on cards

2. **CalendarView** (`src/components/calendar-view.tsx`)
   - react-big-calendar with date-fns localizer
   - Month and week views
   - Color-coded events by task status
   - "Tasks without due dates" section below calendar

3. **TaskViews** (`src/components/task-views.tsx`)
   - Tab navigation: List | Kanban | Calendar
   - SVG icons for each tab
   - Shared task state across views

### Updated Components
- **page.tsx** — Now uses `TaskViews` wrapper instead of direct list view

### Dependencies Added
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- react-big-calendar, @types/react-big-calendar
- date-fns

## Quality Gates
- ✅ Build passes
- ✅ Lint clean
- ✅ 45 tests passing
- ✅ 94.3% statement coverage (>85% target)

## Technical Decisions
- Used `useDraggable`/`useDroppable` over `SortableContext` since we're moving between columns, not sorting within
- Optimistic updates for drag-and-drop — update local state immediately, persist in background
- Calendar uses `allDay: true` events since tasks have dates but not specific times
- `enGB` locale for date-fns to match user's timezone (Europe/London)
