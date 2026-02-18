# Research: Kanban & Calendar Views

## Metadata
- Feature: kanban-calendar
- Date: 2026-02-18

## Context Provided
Adding Kanban board with drag-and-drop and Calendar view to the existing task management app. All views (List, Kanban, Calendar) on one page via Tabs.

## Problem
Users need multiple ways to visualize their tasks. A Kanban board shows workflow status at a glance with drag-and-drop to change status. A Calendar view shows tasks by due date for time-based planning.

## KB Findings

### Global (kb/global/)
- Engineering Excellence: TDD, quality gates, conventional commits
- Accessibility standards: ensure keyboard navigation for drag-and-drop

### Local (kb/repo/)
- feat/db-setup: SQLite database with tasks table
- feat/server-actions-list: Server Actions CRUD, TaskList component, Shadcn UI

## Web

### @dnd-kit
- Modern drag-and-drop library for React, actively maintained
- DndContext, DragOverlay, useDraggable, useDroppable
- Supports keyboard sensors for accessibility
- For Kanban: use DndContext with droppable columns and draggable cards
- Need @dnd-kit/core and @dnd-kit/sortable packages

### react-big-calendar
- Google Calendar-like component for React
- Requires date localizer (date-fns recommended)
- Must import CSS: `react-big-calendar/lib/css/react-big-calendar.css`
- Container must have explicit height
- Events need start/end dates, title

## Codebase
- src/actions/tasks.ts — getTasks, createTask, updateTask, deleteTask
- src/components/task-list.tsx — existing list view
- src/components/ui/ — Shadcn components available
- Need to add Tabs component from Shadcn

## Constraints
- All views on one page via Tabs
- Drag-and-drop updates must persist via Server Actions
- Calendar needs tasks with due_date; tasks without dates show in a separate section

## Dependencies
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- react-big-calendar, date-fns
- Shadcn Tabs component
