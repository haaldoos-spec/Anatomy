import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, language } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, password, full_name, language)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, name || null, language || 'en');

    // Create token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name: name,
        full_name: name,
        language: language || 'en',
        level: 1,
        xp: 0,
        subscription_status: 'free'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        full_name: user.full_name,
        language: user.language,
        level: user.level,
        xp: user.xp,
        subscription_status: user.subscription_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const user: any = db.prepare('SELECT id, email, full_name, language, level, xp, subscription_status, created_at FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
