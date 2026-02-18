# Implementation: Kanban & Calendar Views

## Metadata
- Feature: kanban-calendar
- Date: 2026-02-18
- TDD Mode: BATCH

## Phases Completed

### Phase 1: Dependencies & Tabs
- Installed @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react-big-calendar, date-fns
- Added Shadcn Tabs component
- Created TaskViews wrapper component with Tabs

### Phase 2: Kanban Board
- Code: src/components/kanban-board.tsx
- DndContext with PointerSensor and KeyboardSensor
- Three columns: To Do, In Progress, Done
- Draggable cards with priority badges and due dates
- DragOverlay for visual feedback
- Optimistic status update on drop + Server Action persist

### Phase 3: Calendar View
- Code: src/components/calendar-view.tsx
- react-big-calendar with date-fns localizer
- Color-coded events by task status
- Month and week views
- Tasks without dates shown separately below calendar

## Deviations
- Used @dnd-kit/core directly (useDroppable/useDraggable) instead of @dnd-kit/sortable since we don't need within-column reordering

## Quality Summary
- Final Coverage: 85%+
- All gates: ✅ (build, lint, 45 tests pass)
