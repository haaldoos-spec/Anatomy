# Deployment Guide - AnatoMentor

This document provides the exact settings required to deploy the AnatoMentor backend and frontend, with a focus on resolving common configuration errors.

## Recommended Path
The recommended way to deploy the backend is as a **Web Service on Render** using the **Node.js runtime** (Non-Docker flow).

---

## 1. Fixing the "Root directory ' npm run dev.' does not exist" Error

This error occurs when a command is accidentally pasted into the **Root Directory** field of your deployment dashboard.

### Step-by-Step Correction (Render/Railway):
1. Open your Web Service settings in the dashboard.
2. Locate the **Root Directory** field.
3. If it contains `npm run dev` or any other command, **delete it**.
4. Set the **Root Directory** to exactly: `backend`
5. Save the changes and trigger a new deploy.

---

## 2. Backend Deployment Settings (Non-Docker Flow)

Use these settings for a standard Node.js deployment (e.g., on Render or Railway).

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### Required Environment Variables:
- `PORT`: `3001` (Note: Render assigns this automatically, but you can set it explicitly).
- `JWT_SECRET`: A long random string for authentication.
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `OPENAI_API_KEY`: Your OpenAI API key.

---

## 3. Backend Deployment Settings (Docker Flow)

If you prefer using Docker, the repository includes a `backend/Dockerfile`.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` (relative to Root Directory) |

*Note: Ensure port `3001` is exposed in your platform settings if using Docker.*

---

## 4. Frontend Deployment Settings (Vercel)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## 5. Verification (Clean Environment)

To verify the backend is ready for production, you can run these commands in a clean environment:

```bash
cd backend
npm install
npm run build
PORT=3005 NODE_ENV=production node dist/server.js
```

**Expected Output Snippet:**
```
Database initialized at: /.../backend/database.sqlite
Loading existing database from disk (or creating new)
Server is running on port 3005
```
