"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { KanbanBoard } from "@/components/kanban-board";
import { CalendarView } from "@/components/calendar-view";

export function TaskViews({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="list" className="gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          List
        </TabsTrigger>
        <TabsTrigger value="kanban" className="gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          Kanban
        </TabsTrigger>
        <TabsTrigger value="calendar" className="gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <TaskList initialTasks={tasks} />
      </TabsContent>
      <TabsContent value="kanban">
        <KanbanBoard initialTasks={tasks} onTasksChange={setTasks} />
      </TabsContent>
      <TabsContent value="calendar">
        <CalendarView initialTasks={tasks} />
      </TabsContent>
    </Tabs>
  );
}
