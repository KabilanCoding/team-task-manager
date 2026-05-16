import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { HttpError } from "../utils/errors.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new HttpError(401, "Authentication token is required");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.execute(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [payload.id]
    );

    if (!rows.length) {
      throw new HttpError(401, "User no longer exists");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(error.status ? error : new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") {
    return next(new HttpError(403, "Admin access required"));
  }

  next();
}
