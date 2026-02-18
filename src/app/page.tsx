import { getTasks } from "@/actions/tasks";
import { TaskList } from "@/components/task-list";

export default async function Home() {
  const tasks = await getTasks({});

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-muted-foreground">Manage and track your work</p>
      </div>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
