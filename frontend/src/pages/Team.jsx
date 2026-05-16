import { Card, CardHeader } from "../components/Card";
import { DataTable } from "../components/DataTable";

export function Team({ users }) {
  const columns = [
    { key: "name", label: "Name", render: (user) => <span className="font-semibold text-slate-950">{user.name}</span> },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (user) => <span className="capitalize">{user.role}</span> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Team</p>
        <h1 className="text-3xl font-extrabold text-slate-950">Workspace members</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review users and roles before assigning projects or tasks.
        </p>
      </div>
      <Card>
        <CardHeader title="People and roles" eyebrow="Admin view" />
        <DataTable columns={columns} rows={users} />
      </Card>
    </div>
  );
}
