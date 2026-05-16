import { ClipboardCheck, FolderKanban, LayoutDashboard, LogOut, Menu, Users } from "lucide-react";
import { Button } from "./Button";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: ClipboardCheck },
  { id: "team", label: "Team", icon: Users, adminOnly: true }
];

export function Navbar({ activeTab, onTabChange, user, onLogout }) {
  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white/95 backdrop-blur lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-blue-900/20">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Team Task</p>
            <h1 className="text-xl font-extrabold text-slate-950">Manager</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="secondary" className="h-9 px-3" onClick={onLogout}>
            <LogOut size={16} />
            <span className="sr-only sm:not-sr-only">Sign out</span>
          </Button>
          <Menu className="text-slate-400" />
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
        {tabs.filter((tab) => !tab.adminOnly || user.role === "admin").map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-brand-600 text-white shadow-sm shadow-blue-900/10" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-slate-100 p-4 lg:block">
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="font-bold text-slate-900">{user.name}</p>
          <p className="text-sm capitalize text-slate-500">{user.role}</p>
        </div>
        <Button variant="secondary" className="w-full" onClick={onLogout}>
          <LogOut size={17} />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
