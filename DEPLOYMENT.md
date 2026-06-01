# Deployment Guide - AnatoMentor

This document provides the exact settings required to deploy the AnatoMentor backend and frontend, with a focus on resolving common configuration errors.

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

## 2. Backend Deployment Settings (Early Stage Flow)

Use these settings for a simplified deployment using `ts-node-dev` (no build step required).

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run dev` |

### Required Environment Variables:
- `PORT`: `3001` (Note: Render assigns this automatically, but you can set it explicitly).
- `JWT_SECRET`: A long random string for authentication.
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `TS_NODE_DEV_NO_NOTIFY`: `true` (Recommended to avoid desktop notification errors in cloud environments).

---

## 3. Backend Deployment Settings (Docker Flow)

If you prefer using Docker, the repository includes a `backend/Dockerfile` configured to run `ts-node-dev`.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` (relative to Root Directory) |

---

## 4. Frontend Deployment Settings (Vercel)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## 5. Verification (Local/Early Stage)

To verify the backend is running correctly:

```bash
cd backend
npm install
npm run dev
```

**Expected Output Snippet:**
```
Initializing database at: .../backend/database.sqlite
Database initialized
Server is running on port 3001
```
