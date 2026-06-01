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

## 2. Backend Deployment (Render / Railway)

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

## 3. Frontend Deployment (Vercel / Netlify)

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |

---

## 4. Troubleshooting
### Error: "Root directory 'npm run dev' does not exist"
This occurs if the start command was accidentally pasted into the **Root Directory** field in the Render/Railway dashboard. 
**Fix**: Set **Root Directory** to `backend` and move the command to the **Start Command** field.
