import pool from "../config/db.js";

export async function listMembers(_req, res) {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, created_at FROM users ORDER BY name ASC"
  );

  res.json({ users: rows });
}
