import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';

export const getQuestions = (req: Request, res: Response) => {
  const level = parseInt(req.query.level as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    // Fetch quizzes matching the difficulty level
    const quizzes = db.prepare('SELECT id FROM quizzes WHERE difficulty_level <= ?').all(level) as { id: string }[];
    const quizIds = quizzes.map(q => q.id);

    if (quizIds.length === 0) {
      return res.json([]);
    }

    // Fetch random questions from these quizzes
    const placeholders = quizIds.map(() => '?').join(',');
    const questions = db.prepare(`
      SELECT * FROM questions 
      WHERE quiz_id IN (${placeholders}) 
      ORDER BY RANDOM() 
      LIMIT ?
    `).all(...quizIds, limit);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const submitQuiz = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { questionId, answer, language } = req.body;

  if (!questionId || answer === undefined) {
    return res.status(400).json({ error: 'questionId and answer are required' });
  }

  try {
    // Fetch the question to check correctness
    const question: any = db.prepare('SELECT * FROM questions WHERE id = ?').get(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const lang = language === 'sv' ? 'sv' : 'en';
    const correctAnswer = lang === 'sv' ? question.correct_answer_sv : question.correct_answer_en;
    const explanation = lang === 'sv' ? question.explanation_sv : question.explanation_en;
    
    const isCorrect = answer === correctAnswer;
    const xpEarned = isCorrect ? 10 : 0;

    // Get current user stats
    const user: any = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);
    let newXp = user.xp + xpEarned;
    let newLevel = user.level;

    // Level progression logic: 100 XP to level up
    const xpPerLevel = 100;
    let leveledUp = false;
    while (newXp >= xpPerLevel) {
      newXp -= xpPerLevel;
      newLevel += 1;
      leveledUp = true;
    }

    // Update user stats
    db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXp, newLevel, userId);

    // Track in scores table (as a single question result for now)
    db.prepare(`
      INSERT INTO scores (id, user_id, quiz_id, score, total_questions)
      VALUES (?, ?, ?, ?, ?)
    `).run(uuidv4(), userId, question.quiz_id, isCorrect ? 1 : 0, 1);

    res.json({
      correct: isCorrect,
      explanation,
      xpEarned,
      newLevel,
      xpToNextLevel: xpPerLevel - newXp,
      leveledUp
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

export const getProgress = (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const user: any = db.prepare('SELECT xp, level FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recentScores = db.prepare(`
      SELECT s.*, q.title_en, q.title_sv 
      FROM scores s
      LEFT JOIN quizzes q ON s.quiz_id = q.id
      WHERE s.user_id = ?
      ORDER BY s.completed_at DESC
      LIMIT 10
    `).all(userId);

    res.json({
      level: user.level,
      totalXp: user.xp, // This is current level XP based on previous logic
      xpToNextLevel: 100 - user.xp,
      recentQuizzes: recentScores
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
