import { AlertTriangle, CheckCircle2, ClipboardList, Clock3, FolderKanban } from "lucide-react";
import { Card, CardHeader } from "../components/Card";
import { DataTable } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";

export function Dashboard({ summary, tasks, user }) {
  const completion = summary.total ? Math.round((summary.done / summary.total) * 100) : 0;
  const columns = [
    { key: "title", label: "Task", render: (task) => <span className="font-semibold text-slate-950">{task.title}</span> },
    { key: "project_name", label: "Project" },
    { key: "assignee_name", label: "Owner" },
    { key: "due_date", label: "Due date" },
    { key: "status", label: "Status", render: (task) => <StatusBadge status={task.status} dueDate={task.due_date} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">{user.role} dashboard</p>
          <h1 className="text-3xl font-extrabold text-slate-950">Good to see you, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track ownership, delivery status, and overdue work without switching tools.
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Completion</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-success" style={{ width: `${completion}%` }} />
            </div>
            <span className="text-sm font-extrabold text-slate-950">{completion}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="Total tasks" value={summary.total} />
        <StatCard icon={Clock3} label="Pending" value={summary.pending} tone="slate" />
        <StatCard icon={FolderKanban} label="In progress" value={summary.inProgress} />
        <StatCard icon={CheckCircle2} label="Done" value={summary.done} tone="green" />
        <StatCard icon={AlertTriangle} label="Overdue" value={summary.overdue} tone="red" />
      </div>

      <Card>
        <CardHeader title={user.role === "admin" ? "All active work" : "My assigned work"} eyebrow="Priority queue" />
        <DataTable columns={columns} rows={tasks} />
      </Card>
    </div>
  );
}
