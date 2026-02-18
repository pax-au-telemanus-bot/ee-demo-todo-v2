"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus, TaskPriority } from "@/lib/types";
import { updateTask } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";

const columns: { id: TaskStatus; label: string; color: string; bgColor: string }[] = [
  { id: "todo", label: "To Do", color: "border-slate-300", bgColor: "bg-slate-50 dark:bg-slate-900/50" },
  { id: "in-progress", label: "In Progress", color: "border-blue-300", bgColor: "bg-blue-50 dark:bg-blue-950/50" },
  { id: "done", label: "Done", color: "border-green-300", bgColor: "bg-green-50 dark:bg-green-950/50" },
];

const priorityColors: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function KanbanCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white dark:bg-zinc-900 rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium text-sm leading-snug">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority]}`}>
          {task.priority}
        </Badge>
        {task.due_date && (
          <span className="text-[10px] text-muted-foreground">{formatDate(task.due_date)}</span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
}: {
  column: (typeof columns)[0];
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border-2 ${column.color} ${column.bgColor} ${isOver ? "ring-2 ring-primary/30" : ""} transition-all`}
    >
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm">{column.label}</h3>
        <span className="text-xs text-muted-foreground bg-background rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="p-2 space-y-2 min-h-[200px] flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  initialTasks,
  onTasksChange,
}: {
  initialTasks: Task[];
  onTasksChange?: (tasks: Task[]) => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id.toString() === event.active.id);
    if (task) setActiveTask(task);
  }, [tasks]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = parseInt(active.id as string);
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== newStatus) {
      // Optimistic update
      const updated = { ...task, status: newStatus };
      const newTasks = tasks.map((t) => (t.id === taskId ? updated : t));
      setTasks(newTasks);
      onTasksChange?.(newTasks);

      // Persist
      await updateTask(taskId, { status: newStatus });
    }
  }, [tasks, onTasksChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.status === col.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border p-3 shadow-lg w-64 rotate-2">
            <p className="font-medium text-sm">{activeTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
