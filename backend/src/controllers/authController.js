import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { HttpError } from "../utils/errors.js";

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function signup(req, res) {
  const { name, email, password, role = "member" } = req.body;
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, normalizedEmail, passwordHash, role]
    );

    const user = { id: result.insertId, name, email: normalizedEmail, role };
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new HttpError(409, "Email is already registered");
    }
    throw error;
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const [rows] = await pool.execute(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email.toLowerCase()]
  );

  const user = rows[0];
  const validPassword = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!user || !validPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  res.json({ token: signToken(user), user: publicUser(user) });
}

export function me(req, res) {
  res.json({ user: req.user });
}
