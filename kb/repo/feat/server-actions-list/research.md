# Research: Server Actions & List View

## Metadata
- Feature: server-actions-list
- Date: 2026-02-18

## Context Provided
Implementing CRUD operations via Next.js Server Actions and a polished list view with Shadcn UI components. Filters for status, priority, due date range, and text search.

## Problem
The app has a database but no way to interact with it. Need Server Actions for CRUD and a professional list view UI with filtering capabilities.

## KB Findings

### Global (kb/global/)
- Engineering Excellence standards: TDD, quality gates, conventional commits
- QA standards: meaningful test coverage ≥85%

### Local (kb/repo/)
- feat/db-setup: SQLite with better-sqlite3 established, types defined in src/lib/types.ts
- Database singleton pattern in src/lib/db.ts

## Web

### Next.js Server Actions
- Use `"use server"` directive in separate files (src/actions/)
- Call `revalidatePath("/")` after mutations to refresh data
- Server Actions can be called from Client Components via form actions or direct invocation
- Return typed results for error handling

### Shadcn UI with Tailwind v4
- Run `npx shadcn@latest init` to set up
- Components installed individually: `npx shadcn@latest add button table input select badge`
- Tailwind v4 compatible with latest shadcn
- CSS variables for theming

## Codebase
- src/lib/db.ts — singleton database access
- src/lib/types.ts — Task, CreateTaskInput, UpdateTaskInput types
- src/lib/seed.ts — 14 seed tasks
- src/app/page.tsx — placeholder page

## Constraints
- Server Actions for mutations only (not queries — use server components)
- Shadcn components are server-component compatible where possible
- Filters require client-side state → Client Components with `"use client"`

## Dependencies
- shadcn/ui (component library)
- lucide-react (icons, comes with shadcn)
