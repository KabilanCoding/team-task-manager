# Team Task Manager Submission Guide

## Required Submission Items

- Live URL: https://team-task-manager-production-911f.up.railway.app/
- Backend Health URL: https://team-task-manager-production-911f.up.railway.app/health
- GitHub repo: https://github.com/KabilanCoding/team-task-manager
- README: included at `README.md`.
- Demo video: record a 2-5 minute walkthrough.

## Recommended Tech Stack

This project uses the preferred stack from the brief:

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express REST APIs
- Database: MySQL
- Auth: JWT with bcrypt password hashing
- Deployment: Railway for MySQL, backend, and frontend
- UI: modern SaaS dashboard with Admin/Member role-based views

## Railway Deployment Checklist

1. Push this repository to GitHub.
2. Create a Railway project.
3. Add a MySQL database service.
4. Open Railway MySQL query console or connect with MySQL Workbench and run `sql/schema.sql`.
5. Add a backend service from the GitHub repo.
6. Set backend root directory to `backend`.
7. Add backend variables:

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

8. Add a frontend service from the same GitHub repo.
9. Set frontend root directory to `frontend`.
10. Add frontend variable:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

11. Redeploy both services after setting final URLs.
12. Test signup, login, Admin project creation, task assignment, Member status update, and dashboard counts.

## Demo Video Script

Use this 2-5 minute flow:

1. Show the live deployed URL.
2. Sign up as an Admin.
3. Create a project.
4. Add or select team members.
5. Create a task and assign it to a Member.
6. Show the Admin dashboard with task totals/status/overdue cards.
7. Log in or switch to a Member account.
8. Show that the Member only sees assigned work.
9. Update a task status.
10. Return to the dashboard and show the progress update.

## Final Submission Template

```text
Project Name: Team Task Manager
Live URL: https://team-task-manager-production-911f.up.railway.app/
GitHub Repo: https://github.com/KabilanCoding/team-task-manager
Backend Health URL: https://team-task-manager-production-911f.up.railway.app/health
Demo Video: demo-recordings/team-task-manager-demo.webm

Tech Stack:
- React + Vite + Tailwind CSS
- Node.js + Express REST APIs
- MySQL
- JWT Authentication
- Railway Deployment
```
