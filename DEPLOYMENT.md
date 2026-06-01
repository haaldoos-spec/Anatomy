# Deployment Guide - AnatoMentor Backend

This guide explains how to deploy the AnatoMentor Backend (Node.js/Express) correctly.

## Common Error: "Root directory ' npm run dev.' does not exist"
If you see this error, it means the **Root Directory** setting in your deployment dashboard (Render, Railway, Vercel, etc.) is misconfigured. 
**Fix:** Ensure the "Root Directory" is set to `backend` and NOT a command like `npm run dev`.

## Recommended Platform Settings

### 1. Render (Web Service)
- **Repo:** This repository
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `PORT`: `3001` (or leave empty if Render assigns one)
  - `JWT_SECRET`: (your secret)
  - `STRIPE_SECRET_KEY`: (your key)
  - `OPENAI_API_KEY`: (your key)

### 2. Railway
- **Root Directory:** `backend`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Environment Variables:** Same as above.

### 3. Vercel (Optional, mostly for Frontend)
If you deploy the backend on Vercel:
- **Project Root:** `backend`
- **Framework Preset:** `Other`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Docker Deployment
We have provided a `backend/Dockerfile` for containerized deployment.
- **Port:** The container exposes port `3001`.
- **Build:** `docker build -t anatomentor-backend ./backend`
- **Run:** `docker run -p 3001:3001 anatomentor-backend`

## Database Note
The backend uses SQLite (`database.sqlite`). In ephemeral environments (like Render or Railway without a persistent disk), the database will reset on every redeploy.
**Recommendation:** For production, consider using a persistent volume/disk and mounting it to the `backend` directory, or switching to a hosted PostgreSQL database.
