# Railway Deployment Guide

## 1) Create Railway account
- Go to Railway and create/sign in to your account.

## 2) Create a new project
- In Railway, create a new empty project.

## 3) Add PostgreSQL service
- Add a PostgreSQL service to the project.
- Railway will generate a connection URL you can use for `DATABASE_URL`.

## 4) Add backend service
- Add a new service from your GitHub repo.
- Set the root directory to `backend/`.
- Railway will use `backend/Dockerfile` and `backend/railway.toml`.

## 5) Add web portal service
- Add another service from the same repo.
- Set the root directory to `web-portal/`.
- Railway will use `web-portal/Dockerfile` and `web-portal/railway.toml`.

## 6) Set environment variables
- Backend:
  - `PORT=3000`
  - `DATABASE_URL=<Railway PostgreSQL URL>`
  - JWT secrets and expirations from `backend/.env.example`
- Web portal:
  - Add required frontend env vars (for example API base URL if used).

## 7) Run Prisma migrations
- In backend service shell, run:
  - `npx prisma migrate deploy`

## 8) Done
- Deploy both services.
- Verify backend health endpoint at `/api/v1`.