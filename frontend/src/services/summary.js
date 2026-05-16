export function buildSummary(tasks) {
  const today = new Date().toISOString().slice(0, 10);

  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    done: tasks.filter((task) => task.status === "done").length,
    overdue: tasks.filter((task) => task.status !== "done" && task.due_date < today).length
  };
}
