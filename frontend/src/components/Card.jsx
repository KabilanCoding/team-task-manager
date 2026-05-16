export function Card({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-slate-200/80 bg-white/95 shadow-soft backdrop-blur ${className}`}>
      {children}
    </section>
  );
}

export function CardHeader({ title, action, eyebrow }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{eyebrow}</p>}
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}
