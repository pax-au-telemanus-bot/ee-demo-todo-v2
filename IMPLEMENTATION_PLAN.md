# Implementation Plan - ee-demo-todo

## Overview
A modern task management application demonstrating the RPIRD workflow with full KB artifact generation.

## Tech Stack
- Next.js 15 (App Router, Server Actions)
- TypeScript (strict mode)
- Tailwind CSS v4
- Shadcn UI components
- SQLite via better-sqlite3
- @dnd-kit (drag-and-drop)
- react-big-calendar (calendar view)
- Jest + React Testing Library

## Phases

### Phase 1: Database Setup (`feat/db-setup`) — ⬜ Pending
- SQLite database with better-sqlite3
- Tasks table: id, title, description, status, priority, due_date, created_at, updated_at
- Status enum: todo, in-progress, done
- Priority enum: high, medium, low
- 14 realistic seed tasks across all statuses/priorities/dates
- RPIRD artifacts: research.md, plan.md, implementation.md, review.md

### Phase 2: Server Actions & List View (`feat/server-actions-list`) — ⬜ Pending
- Server Actions for CRUD operations
- Polished list view with Shadcn UI
- Filters: status, priority, due date range, text search
- Create/edit/delete task modals
- RPIRD artifacts: research.md, plan.md, implementation.md, review.md

### Phase 3: Kanban & Calendar Views (`feat/kanban-calendar`) — ⬜ Pending
- Kanban board with @dnd-kit drag-and-drop
- Calendar view with react-big-calendar
- Tabs component for switching views (List, Kanban, Calendar)
- Real-time updates across all views
- RPIRD artifacts: research.md, plan.md, implementation.md, review.md

### Final: SDLC Documentation — ⬜ Pending
- SECURITY.md
- MOBILE_PACKAGING.md
- CI_CD.md
- Update this plan showing all complete
