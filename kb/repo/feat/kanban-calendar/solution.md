# Solution: Kanban & Calendar Views

## Architecture Decisions

### @dnd-kit over alternatives
Chose @dnd-kit over react-beautiful-dnd (deprecated) and HTML5 drag-and-drop:
- Active maintenance and React 19 compatible
- Lightweight core with composable utilities
- Excellent TypeScript support
- `useDroppable` + `useDraggable` pattern fits column-to-column movement

### react-big-calendar + date-fns
Chose over FullCalendar or custom implementations:
- Lightweight with good month/week views
- date-fns integration avoids moment.js dependency
- Simple event model maps directly to Task type

### Optimistic Updates Pattern
Kanban drag updates local state immediately, then persists via Server Action:
- Provides instant visual feedback
- No loading spinners for drag operations
- Trade-off: if server fails, UI is temporarily inconsistent

## Key Learnings

1. **DnD context needs careful sensor config** — `PointerSensor` with `distance: 5` prevents accidental drags while scrolling
2. **Calendar CSS import** — Must import `react-big-calendar/lib/css/react-big-calendar.css` for proper rendering
3. **Date timezone handling** — Appending `T00:00:00` to date strings prevents timezone offset issues in `new Date()`
4. **Shared state across views** — Parent `TaskViews` component manages task state, passed down to all three views

## Future Improvements
- Add error recovery for failed Kanban drag persistence
- Support creating tasks by clicking calendar dates
- Add drag-and-drop within Kanban columns for priority reordering
- Animate tab transitions
