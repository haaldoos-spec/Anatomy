# AnatoMentor

Interactive human anatomy study tools for human anatomy — combining 3D visualizations, spaced-repetition quizzes, an AI tutor chat, a built-in Pomodoro timer, and gamified level progression.

## Project Structure

- `/` (root): Frontend application (Next.js, TypeScript, Tailwind CSS, Three.js)
- `/backend`: Backend API (Node.js, Express, SQLite, WebSockets)

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Three.js
- Framer Motion (for animations)
- Lucide React (for icons)

### Backend
- Node.js
- Express
- SQLite (via `better-sqlite3`)
- Socket.io (for real-time friend challenges)
- Stripe (for subscriptions)
- OpenAI API (for AI tutor chat)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup
1. From the root directory:
   ```bash
   npm install
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. The server will run on [http://localhost:3001](http://localhost:3001)

## Features
- **3D Anatomy Visualizations**: Interactive models of human body systems.
- **Spaced-Repetition Quizzes**: Track learning progress with levels.
- **AI Tutor Chat**: Get explanations in plain language.
- **Pomodoro Timer**: Stay focused during study sessions.
- **Friend Challenges**: Compete in real-time anatomy battles.
- **English/Swedish Support**: Toggle language on the fly.
