import { getTasks } from "@/actions/tasks";
import { TaskViews } from "@/components/task-views";
import { seed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function Home() {
  seed();
  const tasks = await getTasks({});

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your work efficiently</p>
        </div>
        <TaskViews initialTasks={tasks} />
      </div>
    </main>
  );
}
