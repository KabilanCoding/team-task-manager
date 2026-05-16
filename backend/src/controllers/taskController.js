import pool from "../config/db.js";
import { HttpError } from "../utils/errors.js";

const taskSelect = `
  SELECT t.*, p.name AS project_name, assignee.name AS assignee_name, creator.name AS created_by_name
  FROM tasks t
  JOIN projects p ON p.id = t.project_id
  JOIN users assignee ON assignee.id = t.assigned_to
  JOIN users creator ON creator.id = t.created_by
`;

export async function listTasks(req, res) {
  const params = [];
  let sql = taskSelect;

  if (req.user.role === "member") {
    sql += " WHERE t.assigned_to = ?";
    params.push(req.user.id);
  }

  sql += " ORDER BY t.due_date ASC, t.created_at DESC";
  const [rows] = await pool.execute(sql, params);
  res.json({ tasks: rows });
}

export async function createTask(req, res) {
  const { projectId, title, description, assignedTo, status = "pending", dueDate } = req.body;

  const [membership] = await pool.execute(
    "SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?",
    [projectId, assignedTo]
  );

  if (!membership.length) {
    throw new HttpError(422, "Assigned user must be a member of the project");
  }

  const [result] = await pool.execute(
    `INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [projectId, title, description || null, assignedTo, status, dueDate, req.user.id]
  );

  res.status(201).json({
    task: {
      id: result.insertId,
      project_id: projectId,
      title,
      description,
      assigned_to: assignedTo,
      status,
      due_date: dueDate
    }
  });
}

export async function updateTaskStatus(req, res) {
  const taskId = Number(req.params.id);
  const { status } = req.body;

  const [tasks] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [taskId]);
  const task = tasks[0];

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  if (req.user.role !== "admin" && task.assigned_to !== req.user.id) {
    throw new HttpError(403, "You can only update your assigned tasks");
  }

  await pool.execute("UPDATE tasks SET status = ? WHERE id = ?", [status, taskId]);
  res.json({ message: "Task status updated" });
}

export async function dashboard(req, res) {
  const params = [];
  let scope = "";

  if (req.user.role === "member") {
    scope = " WHERE assigned_to = ?";
    params.push(req.user.id);
  }

  const [summary] = await pool.execute(
    `SELECT
      COUNT(*) AS total,
      SUM(status = 'pending') AS pending,
      SUM(status = 'in-progress') AS in_progress,
      SUM(status = 'done') AS done,
      SUM(status != 'done' AND due_date < CURDATE()) AS overdue
     FROM tasks${scope}`,
    params
  );

  const [upcoming] = await pool.execute(
    `${taskSelect}${scope ? " WHERE t.assigned_to = ?" : ""}
     ORDER BY (t.status != 'done' AND t.due_date < CURDATE()) DESC, t.due_date ASC
     LIMIT 8`,
    params
  );

  res.json({
    summary: {
      total: Number(summary[0]?.total || 0),
      pending: Number(summary[0]?.pending || 0),
      inProgress: Number(summary[0]?.in_progress || 0),
      done: Number(summary[0]?.done || 0),
      overdue: Number(summary[0]?.overdue || 0)
    },
    upcoming
  });
}
