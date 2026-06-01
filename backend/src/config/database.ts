// @ts-ignore
import initSqlJ from 'sql.js';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const dbDir = path.dirname(dbPath);

let db: any = null;
let SQL: any = null;

// Wrapper that mimics better-sqlite3 API
const dbWrapper = {
  prepare: (sql: string) => {
    return {
      get: (...params: any[]) => {
        if (!db) throw new Error('Database not initialized');
        const stmt = db.prepare(sql);
        stmt.bind(params);
        let row: any = undefined;
        if (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          row = {};
          cols.forEach((c: string, i: number) => row[c] = vals[i]);
        }
        stmt.free();
        return row;
      },
      all: (...params: any[]) => {
        if (!db) throw new Error('Database not initialized');
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const rows: any[] = [];
        while (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          const row: any = {};
          cols.forEach((c: string, i: number) => row[c] = vals[i]);
          rows.push(row);
        }
        stmt.free();
        return rows;
      },
      run: (...params: any[]) => {
        if (!db) throw new Error('Database not initialized');
        const stmt = db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        saveDb();
      }
    };
  },
  exec: (sql: string) => {
    if (!db) throw new Error('Database not initialized');
    db.run(sql);
    saveDb();
  }
};

function saveDb() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

export const initDb = async () => {
  if (db) return; // Already initialized

  SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
    full_name TEXT, language TEXT DEFAULT 'en', level INTEGER DEFAULT 1, xp INTEGER DEFAULT 0,
    stripe_customer_id TEXT, stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'free', subscription_plan TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY, title_en TEXT NOT NULL, title_sv TEXT NOT NULL,
    description_en TEXT, description_sv TEXT,
    difficulty_level INTEGER, category TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY, quiz_id TEXT,
    question_en TEXT NOT NULL, question_sv TEXT NOT NULL,
    options_en TEXT, options_sv TEXT,
    correct_answer_en TEXT NOT NULL, correct_answer_sv TEXT NOT NULL,
    explanation_en TEXT, explanation_sv TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY, user_id TEXT, quiz_id TEXT,
    score INTEGER, total_questions INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id TEXT PRIMARY KEY, user_id TEXT, duration_minutes INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY, user_id TEXT, title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, chat_id TEXT, role TEXT, content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY, challenger_id TEXT, challenged_id TEXT,
    status TEXT DEFAULT 'pending',
    challenger_score INTEGER DEFAULT 0, challenged_score INTEGER DEFAULT 0,
    challenger_finished INTEGER DEFAULT 0, challenged_finished INTEGER DEFAULT 0,
    winner_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenger_id) REFERENCES users(id),
    FOREIGN KEY (challenged_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id)
  )`);

  saveDb();

  // Seed data
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM quizzes');
  if (countStmt.step()) {
    const res = countStmt.get();
    if (res[0] === 0) {
      countStmt.free();
      const { seedQuizzes } = require('../utils/seedData');
      seedQuizzes();
    } else {
      countStmt.free();
    }
  } else {
    countStmt.free();
  }

  console.log('Database initialized');
};

export default dbWrapper;
