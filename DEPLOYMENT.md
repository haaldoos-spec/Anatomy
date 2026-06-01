# Deployment Guide - AnatoMentor

This document provides the exact settings required to deploy AnatoMentor to production environments (Render, Railway, etc.).

## 1. Pre-Deployment Checklist
Always run the automated preflight check before pushing changes:
```bash
npm run verify-deployment
```
This script ensures:
- All `package.json` files are valid JSON.
- Production scripts (`build`, `start`) are present and valid.

---

## 2. Backend Deployment (Node.js Runtime)

Use these settings for a standard production deployment.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### Required Environment Variables
- `PORT`: `3001` (Note: Render assigns this automatically).
- `JWT_SECRET`: A secure random string.
- `STRIPE_SECRET_KEY`: Your Stripe secret.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `NODE_ENV`: `production`

---

## 3. Backend Deployment (Docker)

Use the provided `backend/Dockerfile` for containerized deployment.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |

### Local Docker Verification
```bash
cd backend
docker build -t anatomentor-backend .
docker run -p 3001:3001 anatomentor-backend
```

---

## 4. Frontend Deployment (Vercel)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## 5. Troubleshooting
### Error: "Root directory 'npm run dev' does not exist"
This occurs if the start command was pasted into the **Root Directory** field. 
**Fix**: Set Root Directory to `backend` and move the command to the **Start Command** field.
