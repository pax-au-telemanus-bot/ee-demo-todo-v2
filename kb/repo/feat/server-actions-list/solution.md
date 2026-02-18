# Solution: Server Actions & List View

## Architecture Decisions

### Server Actions over API Routes
Chose Next.js Server Actions for mutations (create, update, delete) over traditional API routes:
- Co-located with components that use them
- Automatic revalidation via `revalidatePath`
- Type-safe end-to-end without manual API client
- Progressive enhancement friendly

### Separate Queries Module
Data fetching lives in `src/lib/queries.ts` (synchronous, for Server Components) rather than in Server Actions:
- Server Components call queries directly — no async overhead
- Server Actions handle mutations only
- Clear separation of reads vs writes

### Client/Server Component Boundary
- `page.tsx` is a Server Component (fetches data)
- Filter state management requires `"use client"` (URL search params)
- Task interactions (create/edit/delete) handled by client wrapper `TaskListClient`

## Key Learnings

1. **Shadcn Select and `name` attribute** — Shadcn's `<Select>` doesn't natively support `name` for form submission. Worked around by using hidden inputs or direct state management.
2. **`revalidatePath("/")` after mutations** — Essential for refreshing Server Component data after a Server Action.
3. **Search params as filter state** — Using URL params makes filters shareable and bookmarkable.
4. **Optimistic UI not needed yet** — For a demo app, simple `useTransition` pending states are sufficient.

## Patterns Established
- Server Actions in `src/actions/` with `"use server"` directive
- Query functions in `src/lib/queries.ts` for Server Component data fetching
- Client wrapper pattern: Server Component fetches data → passes to client component for interactivity
