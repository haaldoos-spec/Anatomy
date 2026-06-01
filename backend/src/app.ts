import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import pomodoroRoutes from './routes/pomodoroRoutes';
import quizRoutes from './routes/quizRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import challengeRoutes from './routes/challengeRoutes';
import { logger } from './middleware/logger';

const app = express();

app.use(cors());

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/subscriptions/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// For webhook, use raw body
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/challenge', challengeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AnatoMentor API is running' });
});

export default app;
