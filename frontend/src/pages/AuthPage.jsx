import { useState } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-7">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-blue-900/20">
              <CheckCircle2 />
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Team Task Manager</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
              {mode === "login" ? "Welcome back" : "Create your workspace account"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage projects, assignments, and delivery progress from one role-aware workspace.
            </p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Name</span>
                <div className="flex items-center rounded-md border border-slate-200 bg-white px-3">
                  <UserRound size={18} className="text-slate-400" />
                  <input className="w-full px-3 py-3 outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Email</span>
              <div className="flex items-center rounded-md border border-slate-200 bg-white px-3">
                <Mail size={18} className="text-slate-400" />
                <input className="w-full px-3 py-3 outline-none" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Password</span>
              <div className="flex items-center rounded-md border border-slate-200 bg-white px-3">
                <LockKeyhole size={18} className="text-slate-400" />
                <input className="w-full px-3 py-3 outline-none" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </label>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Role</span>
                <select className="w-full rounded-md border border-slate-200 px-3 py-3 outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
            {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-danger">{error}</p>}
            <Button className="w-full" disabled={loading}>
              {loading ? "Please wait" : mode === "login" ? "Log in" : "Sign up"}
              <ArrowRight size={17} />
            </Button>
          </form>
          <button className="mt-5 text-sm font-semibold text-brand-700" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </section>
      <section className="hidden overflow-hidden bg-brand-700 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-100">Role-based execution</p>
          <h2 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">Projects, assignments, and progress in one operational view.</h2>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-100">Launch sprint</p>
              <p className="text-2xl font-extrabold">72% complete</p>
            </div>
            <span className="rounded-full bg-green-400/20 px-3 py-1 text-sm font-bold text-green-100">On track</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[72%] rounded-full bg-green-300" />
          </div>
          <div className="grid gap-3">
            {["Admin project controls", "Member task queues", "Overdue visibility"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-3">
                <CheckCircle2 size={18} />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
