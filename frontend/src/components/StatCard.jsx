export function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-brand-600 ring-blue-100",
    green: "bg-green-50 text-success ring-green-100",
    red: "bg-red-50 text-danger ring-red-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  return (
    <div className="group rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ring-1 ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}
