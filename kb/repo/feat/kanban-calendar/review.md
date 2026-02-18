# Review: Kanban & Calendar Views

## Metadata
- Feature: kanban-calendar
- Date: 2026-02-18
- Verdict: READY

## Plan Compliance
All acceptance criteria met:
- ✅ Drag-and-drop Kanban board with three status columns
- ✅ Calendar view with month/week views
- ✅ Tab navigation between List/Kanban/Calendar
- ✅ Status updates persist on drag
- ✅ Color-coded events by status
- ✅ Tasks without dates shown separately

## Code Review

### Correctness ✅
- Drag-and-drop correctly maps column IDs to TaskStatus values
- Optimistic update followed by server persistence
- Calendar events properly filtered to tasks with due dates
- Date handling uses `T00:00:00` suffix to avoid timezone issues

### Security ✅
- All mutations go through Server Actions
- No client-side database access
- No user input directly in SQL queries

### Performance ✅
- `useMemo` for calendar event computation
- Activation constraint on pointer sensor prevents accidental drags
- Column task filtering is O(n) per column

### Maintainability ✅
- Components are focused and single-responsibility
- TaskViews orchestrates all three views cleanly
- Shared types throughout

## Issues Found

### P3 (Low)
1. No loading state during Kanban drag persistence — if server action fails, optimistic update stays
2. Calendar view doesn't support task creation by clicking on a date
3. No keyboard navigation for Kanban drag-and-drop (KeyboardSensor configured but no sortable context)

## PR Description
```
feat: add Kanban board and Calendar views

- Implement drag-and-drop Kanban board with @dnd-kit for task status management
- Add calendar view with react-big-calendar showing tasks by due date
- Create tab navigation between List, Kanban, and Calendar views
- Optimistic updates on drag with server persistence
- Color-coded events and priority badges throughout
```
