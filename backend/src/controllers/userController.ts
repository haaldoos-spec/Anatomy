import { Request, Response } from 'express';
import db from '../config/database';

export const getUsers = (req: Request, res: Response) => {
  try {
    const users = db.prepare('SELECT id, email, full_name, language, level, xp, subscription_status, created_at FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
