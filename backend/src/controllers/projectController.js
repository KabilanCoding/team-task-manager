import pool from "../config/db.js";
import { HttpError } from "../utils/errors.js";

export async function listProjects(req, res) {
  const params = [];
  let sql = `
    SELECT p.*, u.name AS creator_name,
      COUNT(DISTINCT pm.user_id) AS member_count,
      COUNT(DISTINCT t.id) AS task_count
    FROM projects p
    JOIN users u ON u.id = p.created_by
    LEFT JOIN project_members pm ON pm.project_id = p.id
    LEFT JOIN tasks t ON t.project_id = p.id
  `;

  if (req.user.role !== "admin") {
    sql += " WHERE pm.user_id = ?";
    params.push(req.user.id);
  }

  sql += " GROUP BY p.id ORDER BY p.created_at DESC";
  const [rows] = await pool.execute(sql, params);
  res.json({ projects: rows });
}

export async function createProject(req, res) {
  const { name, description, memberIds = [] } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [projectResult] = await connection.execute(
      "INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)",
      [name, description || null, req.user.id]
    );

    const projectId = projectResult.insertId;
    const uniqueMemberIds = [...new Set([req.user.id, ...memberIds.map(Number)])];

    for (const memberId of uniqueMemberIds) {
      await connection.execute(
        "INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)",
        [projectId, memberId]
      );
    }

    await connection.commit();
    res.status(201).json({ project: { id: projectId, name, description, created_by: req.user.id } });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getProject(req, res) {
  const [projects] = await pool.execute(
    `SELECT p.*, u.name AS creator_name
     FROM projects p
     JOIN users u ON u.id = p.created_by
     WHERE p.id = ?`,
    [req.params.id]
  );

  if (!projects.length) {
    throw new HttpError(404, "Project not found");
  }

  if (req.user.role !== "admin") {
    const [membership] = await pool.execute(
      "SELECT user_id FROM project_members WHERE project_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (!membership.length) {
      throw new HttpError(403, "You are not assigned to this project");
    }
  }

  const [members] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.role
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = ?
     ORDER BY u.name`,
    [req.params.id]
  );

  res.json({ project: { ...projects[0], members } });
}

export async function assignMembers(req, res) {
  const { memberIds } = req.body;
  const projectId = Number(req.params.id);

  const [projects] = await pool.execute("SELECT id FROM projects WHERE id = ?", [projectId]);
  if (!projects.length) {
    throw new HttpError(404, "Project not found");
  }

  for (const memberId of [...new Set(memberIds.map(Number))]) {
    await pool.execute(
      "INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)",
      [projectId, memberId]
    );
  }

  res.json({ message: "Members assigned" });
}
