import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardHeader } from "../components/Card";
import { Modal } from "../components/Modal";

export function Projects({ projects, users, user, onCreateProject }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", memberIds: [] });

  const submit = (event) => {
    event.preventDefault();
    onCreateProject(form);
    setForm({ name: "", description: "", memberIds: [] });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Projects</p>
          <h1 className="text-3xl font-extrabold text-slate-950">Team workspaces</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep delivery areas organized with clear ownership and assigned members.
          </p>
        </div>
        {user.role === "admin" && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={18} />
            New project
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{project.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
              </div>
              <div className="rounded-md bg-blue-50 p-2 text-brand-600 ring-1 ring-blue-100">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-brand-600" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-bold text-slate-950">{project.task_count || 0}</p>
                <p className="text-slate-500">Tasks</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-bold text-slate-950">{project.member_count || 0}</p>
                <p className="text-slate-500">Members</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-bold text-slate-950">{project.creator_name || user.name}</p>
                <p className="text-slate-500">Owner</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal title="Create project" open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Project name</span>
            <input className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-brand-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
            <textarea className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-brand-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Assign members</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {users.filter((member) => member.role === "member").map((member) => (
                <label key={member.id} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.memberIds.includes(member.id)}
                    onChange={(e) => {
                      const memberIds = e.target.checked
                        ? [...form.memberIds, member.id]
                        : form.memberIds.filter((id) => id !== member.id);
                      setForm({ ...form, memberIds });
                    }}
                  />
                  {member.name}
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full">Create project</Button>
        </form>
      </Modal>
    </div>
  );
}
