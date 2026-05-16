import pool from "./db.js";

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_created_by
      FOREIGN KEY (created_by) REFERENCES users(id)
      ON DELETE RESTRICT
  )`,
  `CREATE TABLE IF NOT EXISTS project_members (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_project_members_project
      FOREIGN KEY (project_id) REFERENCES projects(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_project_members_user
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    assigned_to INT NOT NULL,
    status ENUM('pending', 'in-progress', 'done') NOT NULL DEFAULT 'pending',
    due_date DATE NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_project
      FOREIGN KEY (project_id) REFERENCES projects(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assigned_to
      FOREIGN KEY (assigned_to) REFERENCES users(id)
      ON DELETE RESTRICT,
    CONSTRAINT fk_tasks_created_by
      FOREIGN KEY (created_by) REFERENCES users(id)
      ON DELETE RESTRICT,
    INDEX idx_tasks_assigned_to (assigned_to),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_due_date (due_date)
  )`
];

export async function runMigrations() {
  for (const statement of statements) {
    await pool.execute(statement);
  }
}
