import { getDb } from "./db";

export const SEED_TASKS = [
  { title: "Design system architecture document", description: "Create comprehensive architecture decision records for the new microservices migration", status: "done", priority: "high", due_date: "2026-02-10" },
  { title: "Set up CI/CD pipeline", description: "Configure GitHub Actions with build, test, lint, and deploy stages", status: "done", priority: "high", due_date: "2026-02-12" },
  { title: "Implement user authentication", description: "Add OAuth 2.0 with Google and GitHub providers using NextAuth.js", status: "done", priority: "high", due_date: "2026-02-14" },
  { title: "Database schema migration", description: "Migrate from PostgreSQL to SQLite for local development simplicity", status: "done", priority: "medium", due_date: "2026-02-08" },
  { title: "Write API integration tests", description: "Cover all REST endpoints with integration tests using supertest", status: "in-progress", priority: "high", due_date: "2026-02-20" },
  { title: "Refactor dashboard components", description: "Break down monolithic dashboard into smaller, reusable components", status: "in-progress", priority: "medium", due_date: "2026-02-22" },
  { title: "Optimize database queries", description: "Add proper indexes and fix N+1 query issues in task listing", status: "in-progress", priority: "high", due_date: "2026-02-19" },
  { title: "Update project documentation", description: "Refresh README, API docs, and contributing guidelines", status: "in-progress", priority: "low", due_date: "2026-02-25" },
  { title: "Add dark mode support", description: "Implement system-aware dark/light theme toggle with Tailwind", status: "todo", priority: "medium", due_date: "2026-02-28" },
  { title: "Performance audit and optimization", description: "Run Lighthouse audit and optimize Core Web Vitals scores", status: "todo", priority: "high", due_date: "2026-03-01" },
  { title: "Mobile responsive redesign", description: "Redesign task views for optimal mobile and tablet experience", status: "todo", priority: "medium", due_date: "2026-03-05" },
  { title: "Add keyboard shortcuts", description: "Implement common keyboard shortcuts for power users (Cmd+K, etc.)", status: "todo", priority: "low", due_date: "2026-03-10" },
  { title: "Set up error monitoring", description: "Integrate Sentry for production error tracking and alerting", status: "todo", priority: "medium", due_date: "2026-03-03" },
  { title: "Accessibility compliance review", description: "Ensure WCAG 2.1 AA compliance across all interactive components", status: "todo", priority: "high", due_date: null },
];

export function seed(): number {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as count FROM tasks").get() as { count: number }).count;
  if (count > 0) {
    console.log(`Database already has ${count} tasks, skipping seed.`);
    return count;
  }

  const insert = db.prepare(
    "INSERT INTO tasks (title, description, status, priority, due_date) VALUES (@title, @description, @status, @priority, @due_date)"
  );

  const insertMany = db.transaction((tasks: typeof SEED_TASKS) => {
    for (const task of tasks) insert.run(task);
  });

  insertMany(SEED_TASKS);
  console.log(`Seeded ${SEED_TASKS.length} tasks.`);
  return SEED_TASKS.length;
}

// Run directly
if (require.main === module) {
  seed();
}
