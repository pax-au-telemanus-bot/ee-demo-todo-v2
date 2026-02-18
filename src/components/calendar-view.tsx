"use client";

import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task, TaskStatus } from "@/lib/types";

const locales = { "en-GB": enGB };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const statusColors: Record<TaskStatus, string> = {
  todo: "#94a3b8",
  "in-progress": "#3b82f6",
  done: "#22c55e",
};

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

export function CalendarView({ initialTasks }: { initialTasks: Task[] }) {
  const events = useMemo<CalendarEvent[]>(() => {
    return initialTasks
      .filter((t) => t.due_date)
      .map((task) => {
        const date = new Date(task.due_date + "T00:00:00");
        return {
          id: task.id,
          title: task.title,
          start: date,
          end: date,
          allDay: true,
          resource: task,
        };
      });
  }, [initialTasks]);

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: statusColors[event.resource.status],
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontSize: "12px",
      padding: "2px 6px",
    },
  });

  const noDateTasks = initialTasks.filter((t) => !t.due_date);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border p-4 shadow-sm" style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK]}
          eventPropGetter={eventStyleGetter}
          popup
          style={{ height: "100%" }}
        />
      </div>
      {noDateTasks.length > 0 && (
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold text-sm mb-2 text-muted-foreground">Tasks without due dates ({noDateTasks.length})</h3>
          <div className="flex flex-wrap gap-2">
            {noDateTasks.map((task) => (
              <span key={task.id} className="text-xs bg-muted rounded-md px-2 py-1">{task.title}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
