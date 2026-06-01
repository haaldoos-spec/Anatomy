import { Request, Response } from 'express';
import db from '../config/database';

export const getLeaderboard = (req: Request, res: Response) => {
  try {
    // Top players by win count
    const leaderboard = db.prepare(`
      SELECT u.id, u.full_name, COUNT(c.id) as wins
      FROM users u
      JOIN challenges c ON u.id = c.winner_id
      WHERE c.status = 'completed'
      GROUP BY u.id
      ORDER BY wins DESC
      LIMIT 10
    `).all();

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

export const getHistory = (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const history = db.prepare(`
      SELECT 
        c.*, 
        u1.full_name as challenger_name, 
        u2.full_name as challenged_name,
        u1.email as challenger_email,
        u2.email as challenged_email
      FROM challenges c
      JOIN users u1 ON c.challenger_id = u1.id
      JOIN users u2 ON c.challenged_id = u2.id
      WHERE c.challenger_id = ? OR c.challenged_id = ?
      ORDER BY c.created_at DESC
      LIMIT 50
    `).all(userId, userId);

    res.json(history);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};
