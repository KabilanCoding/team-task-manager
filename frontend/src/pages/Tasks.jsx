import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardHeader } from "../components/Card";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";

export function Tasks({ tasks, projects, users, user, onCreateTask, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    projectId: projects[0]?.id || "",
    title: "",
    description: "",
    assignedTo: users.find((member) => member.role === "member")?.id || "",
    dueDate: new Date().toISOString().slice(0, 10)
  });

  const columns = [
    { key: "title", label: "Task", render: (task) => <span className="font-semibold text-slate-950">{task.title}</span> },
    { key: "project_name", label: "Project" },
    { key: "assignee_name", label: "Assignee" },
    { key: "due_date", label: "Due" },
    { key: "status", label: "Status", render: (task) => <StatusBadge status={task.status} dueDate={task.due_date} /> },
    {
      key: "actions",
      label: "Update",
      render: (task) => (
        <select
          className="rounded-md border border-slate-200 px-2 py-2 text-sm outline-none"
          value={task.status}
          onChange={(event) => onUpdateStatus(task.id, event.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      )
    }
  ];

  const submit = (event) => {
    event.preventDefault();
    onCreateTask(form);
    setForm({ ...form, title: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Tasks</p>
          <h1 className="text-3xl font-extrabold text-slate-950">{user.role === "admin" ? "Assignment board" : "My task queue"}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Move work from pending to done with clear due dates and ownership.
          </p>
        </div>
        {user.role === "admin" && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} />
            New task
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title="Task tracker" eyebrow="Status workflow" />
        <DataTable columns={columns} rows={tasks} />
      </Card>

      <Modal title="Create task" open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Project</span>
            <select className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: Number(e.target.value) })}>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Title</span>
            <input className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
            <textarea className="min-h-24 w-full rounded-md border border-slate-200 px-3 py-3 outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Assignee</span>
              <select className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: Number(e.target.value) })}>
                {users.filter((member) => member.role === "member").map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Due date</span>
              <input className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </label>
          </div>
          <Button className="w-full">Create task</Button>
        </form>
      </Modal>
    </div>
  );
}
