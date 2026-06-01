# Deployment Guide - AnatoMentor

This document provides the exact settings required to deploy AnatoMentor, ensuring stability and performance.

## 1. Pre-Deployment Checklist
Before pushing any changes, run the automated preflight check:
```bash
npm run verify-deployment
```
This script ensures:
- Root and backend `package.json` are valid JSON.
- Required deployment scripts (`build`, `start`) are present.
- Critical configurations are valid.

---

## 2. Backend Deployment (Render/Railway)

The recommended path is using the **Node.js runtime**.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### Environment Variables
- `PORT`: `3001` (Auto-assigned on Render)
- `JWT_SECRET`: [Your Secret]
- `STRIPE_SECRET_KEY`: [Your Secret]
- `OPENAI_API_KEY`: [Your Secret]
- `NODE_ENV`: `production`

---

## 3. Docker Deployment

If deploying via Docker, use the provided `backend/Dockerfile`.

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |

### Verify Docker Locally
```bash
cd backend
docker build -t anatomentor-backend .
docker run -p 3001:3001 --env-file .env anatomentor-backend
```

---

## 4. Frontend Deployment (Vercel)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## 5. Troubleshooting: "Root directory does not exist"
If you see an error like `Root directory 'npm run dev' does not exist`:
1. Go to your dashboard settings.
2. Find the **Root Directory** field.
3. Ensure it is set to `backend`, **not** a command.
4. Commands belong in **Build Command** and **Start Command** fields.
