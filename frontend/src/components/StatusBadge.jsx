export function StatusBadge({ status, dueDate }) {
  const overdue = status !== "done" && dueDate < new Date().toISOString().slice(0, 10);
  const styles = {
    pending: "bg-blue-50 text-brand-700 ring-blue-100",
    "in-progress": "bg-amber-50 text-amber-700 ring-amber-100",
    done: "bg-green-50 text-success ring-green-100"
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${overdue ? "bg-red-50 text-danger ring-red-100" : styles[status]}`}>
      {overdue ? "overdue" : status.replace("-", " ")}
    </span>
  );
}
