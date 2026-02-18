"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { TaskTable } from "./task-table";
import { TaskDialog } from "./task-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Button } from "@/components/ui/button";

interface TaskListClientProps {
  tasks: Task[];
}

export function TaskListClient({ tasks }: TaskListClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTaskState, setDeleteTaskState] = useState<Task | null>(null);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={() => setCreateOpen(true)}>New Task</Button>
      </div>

      <TaskTable
        tasks={tasks}
        onEdit={(task) => setEditTask(task)}
        onDelete={(task) => setDeleteTaskState(task)}
      />

      <TaskDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TaskDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask}
      />
      <DeleteDialog
        open={!!deleteTaskState}
        onOpenChange={(open) => !open && setDeleteTaskState(null)}
        task={deleteTaskState}
      />
    </>
  );
}
