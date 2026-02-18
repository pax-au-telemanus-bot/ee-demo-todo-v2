import { Suspense } from "react";
import { getAllTasks } from "@/lib/queries";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskListClient } from "@/components/tasks/task-list-client";
interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; priority?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const tasks = getAllTasks({
    search: params.search,
    status: params.status,
    priority: params.priority,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-muted-foreground">Manage and track your work</p>
      </div>

      <div className="space-y-4">
        <Suspense fallback={<div>Loading filters...</div>}>
          <TaskFilters />
        </Suspense>

        <TaskListClient tasks={tasks} />
      </div>
    </main>
  );
}
