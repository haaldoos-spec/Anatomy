import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export const initDb = () => {
  // Users Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT,
      language TEXT DEFAULT 'en',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT DEFAULT 'free',
      subscription_plan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Quizzes Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_sv TEXT NOT NULL,
      description_en TEXT,
      description_sv TEXT,
      difficulty_level INTEGER,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Questions Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT,
      question_en TEXT NOT NULL,
      question_sv TEXT NOT NULL,
      options_en TEXT,
      options_sv TEXT,
      correct_answer_en TEXT NOT NULL,
      correct_answer_sv TEXT NOT NULL,
      explanation_en TEXT,
      explanation_sv TEXT,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
  `).run();

  // User Progress/Scores Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      quiz_id TEXT,
      score INTEGER,
      total_questions INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
  `).run();

  // Pomodoro Sessions Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      duration_minutes INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Chats Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  // Messages Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    )
  `).run();

  // Friend Challenges Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      challenger_id TEXT,
      challenged_id TEXT,
      status TEXT DEFAULT 'pending',
      challenger_score INTEGER DEFAULT 0,
      challenged_score INTEGER DEFAULT 0,
      challenger_finished INTEGER DEFAULT 0,
      challenged_finished INTEGER DEFAULT 0,
      winner_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (challenger_id) REFERENCES users(id),
      FOREIGN KEY (challenged_id) REFERENCES users(id),
      FOREIGN KEY (winner_id) REFERENCES users(id)
    )
  `).run();

  // Seed data if empty
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get() as { count: number };
  if (quizCount.count === 0) {
    const { seedQuizzes } = require('../utils/seedData');
    seedQuizzes();
  }

  console.log('Database initialized');
};

export default db;