# Deployment Guide - AnatoMentor

This document provides the exact settings required to deploy AnatoMentor to production environments (Render, Railway, etc.).

## 1. Quick Start (Render / Railway)

The supported deployment path for the backend is as a **Web Service** using the **Node.js runtime**.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### Required Environment Variables
- `PORT`: `3001` (Note: Render assigns this automatically).
- `JWT_SECRET`: A secure random string for signing tokens.
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `NODE_ENV`: `production`

---

## 2. Pre-Deployment Checklist
Always run the automated preflight check before pushing changes:
```bash
npm run verify-deployment
```
This script ensures:
- All `package.json` files are valid JSON.
- Production scripts (`build`, `start`) are present and valid in the backend.

---

## 3. Frontend Deployment (Vercel / Netlify)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## Appendix: Docker (Optional)
A Dockerfile is provided in the `backend` directory for containerized environments. It uses a multi-stage build to serve the compiled JavaScript output.

To build and run locally:
```bash
cd backend
docker build -t anatomentor-backend .
docker run -p 3001:3001 anatomentor-backend
```
