# Team Task Manager

A full-stack task management app for project teams with JWT authentication, Admin/Member role-based access, project assignment, task tracking, and dashboard reporting.

## Features

- Signup and login with JWT
- Admin and Member roles
- Admin project creation and member assignment
- Admin task creation and assignment
- Member task queue with status updates
- Dashboard cards for total, pending, in-progress, done, and overdue tasks
- Responsive React UI with reusable buttons, cards, tables, modals, and navigation
- MySQL schema with foreign keys and indexes

## Tech Stack

Recommended stack for the assignment:

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express REST APIs
- Database: MySQL
- Authentication: JWT, bcrypt password hashing
- Validation/security: express-validator, Helmet, CORS, rate limiting
- Deployment: Railway for MySQL, backend, and frontend

## Project Structure

```text
team-task-manager/
  backend/
    src/
      config/
      controllers/
      middleware/
      routes/
      utils/
  frontend/
    src/
      components/
      context/
      pages/
      services/
  sql/
    schema.sql
```

## Local Setup

1. Create the MySQL database and tables:

```bash
mysql -u root -p < sql/schema.sql
```

2. Configure the backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

3. Configure the frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Open the frontend at `http://localhost:5173`.

## Environment Variables

Backend:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=password
MYSQLDATABASE=team_task_manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

Frontend:

```env
VITE_API_URL=https://your-api.railway.app/api
```

## REST API

### Auth

`POST /api/auth/signup`

```json
{
  "name": "Ava Patel",
  "email": "ava@example.com",
  "password": "password123",
  "role": "admin"
}
```

`POST /api/auth/login`

```json
{
  "email": "ava@example.com",
  "password": "password123"
}
```

`GET /api/auth/me`

Requires `Authorization: Bearer <token>`.

### Users

`GET /api/users`

Admin only. Returns workspace users for project/task assignment.

### Projects

`GET /api/projects`

Admin sees all projects. Members see assigned projects.

`POST /api/projects`

Admin only.

```json
{
  "name": "Customer Portal Launch",
  "description": "Build auth, dashboard, and team workflows.",
  "memberIds": [2, 3]
}
```

`GET /api/projects/:id`

Admin or assigned member.

`POST /api/projects/:id/members`

Admin only.

```json
{
  "memberIds": [2, 3]
}
```

### Tasks

`GET /api/tasks/dashboard`

Returns summary counts and upcoming/overdue work.

`GET /api/tasks`

Admin sees all tasks. Members see assigned tasks.

`POST /api/tasks`

Admin only.

```json
{
  "projectId": 1,
  "title": "Build dashboard cards",
  "description": "Show status and overdue totals.",
  "assignedTo": 2,
  "status": "pending",
  "dueDate": "2026-06-01"
}
```

`PATCH /api/tasks/:id/status`

Admin or assigned member.

```json
{
  "status": "in-progress"
}
```

## Railway Deployment

Deployment is mandatory for selection. Use Railway for all services so the app is live and fully functional.

1. Create a Railway project.
2. Add a MySQL service.
3. Run `sql/schema.sql` against the Railway MySQL database.
4. Create a backend service from this repo.
5. Set the backend root directory to `backend`.
6. Add backend variables:

```env
NODE_ENV=production
MYSQLHOST=your-railway-mysql-host
MYSQLPORT=your-railway-mysql-port
MYSQLUSER=your-railway-mysql-user
MYSQLPASSWORD=your-railway-mysql-password
MYSQLDATABASE=your-railway-mysql-database
JWT_SECRET=use-a-long-random-production-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

7. Confirm the backend health check works:

```text
https://your-backend-url.up.railway.app/health
```

8. Create a frontend service from this repo.
9. Set the frontend root directory to `frontend`.
10. Add frontend variable:

```env
VITE_API_URL=https://your-backend-domain/api
```

11. Redeploy both services after final backend/frontend URLs are known.

Railway config files are included in `backend/railway.json` and `frontend/railway.json`.

## Submission Assets

- Live URL: add the deployed Railway frontend URL
- Backend URL: add the Railway backend URL
- GitHub repo: push this workspace to GitHub
- README: this file
- Demo video: record a 2-5 minute walkthrough showing signup, project creation, task assignment, member status updates, and dashboard changes

See `SUBMISSION.md` for a deployment checklist, final submission template, and demo video script.

## UI Mockups Included

The React app contains polished mockups and working component states for:

- Authentication
- Admin dashboard
- Member dashboard
- Project management
- Task creation and status tracking
- Team/member list
