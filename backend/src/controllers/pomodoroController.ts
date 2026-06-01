import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';

export const logSession = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { duration_minutes } = req.body;

  if (!duration_minutes) {
    return res.status(400).json({ error: 'Duration is required' });
  }

  try {
    const sessionId = uuidv4();
    db.prepare('INSERT INTO pomodoro_sessions (id, user_id, duration_minutes) VALUES (?, ?, ?)')
      .run(sessionId, userId, duration_minutes);

    res.status(201).json({ id: sessionId, message: 'Session logged successfully' });
  } catch (error) {
    console.error('Failed to log pomodoro session:', error);
    res.status(500).json({ error: 'Failed to log session' });
  }
};

export const getStats = (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // Total sessions and minutes today
    const today = new Date().toISOString().split('T')[0];
    const todayStats = db.prepare(`
      SELECT COUNT(*) as count, SUM(duration_minutes) as total_minutes 
      FROM pomodoro_sessions 
      WHERE user_id = ? AND date(completed_at) = ?
    `).get(userId, today) as { count: number, total_minutes: number | null };

    // Total sessions and minutes this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekStats = db.prepare(`
      SELECT COUNT(*) as count, SUM(duration_minutes) as total_minutes 
      FROM pomodoro_sessions 
      WHERE user_id = ? AND completed_at >= ?
    `).get(userId, oneWeekAgo.toISOString()) as { count: number, total_minutes: number | null };

    res.json({
      today: {
        sessions: todayStats.count,
        minutes: todayStats.total_minutes || 0
      },
      week: {
        sessions: weekStats.count,
        minutes: weekStats.total_minutes || 0
      }
    });
  } catch (error) {
    console.error('Failed to get pomodoro stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
