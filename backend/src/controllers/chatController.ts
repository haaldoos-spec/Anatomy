import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import * as aiService from '../services/aiService';

export const handleChat = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { chatId, message, language } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    let currentChatId = chatId;

    // If no chatId, create a new chat
    if (!currentChatId) {
      currentChatId = uuidv4();
      const title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
      db.prepare('INSERT INTO chats (id, user_id, title) VALUES (?, ?, ?)')
        .run(currentChatId, userId, title);
    }

    // Get previous messages for context
    const previousMessages: any[] = db.prepare('SELECT role, content FROM messages WHERE chat_id = ? ORDER BY created_at ASC')
      .all(currentChatId);

    // Prepare messages for AI
    const apiMessages = [
      ...previousMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // Generate AI response
    const aiResponse = await aiService.generateResponse(apiMessages, language);

    // Save user message
    db.prepare('INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)')
      .run(uuidv4(), currentChatId, 'user', message);

    // Save assistant message
    db.prepare('INSERT INTO messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)')
      .run(uuidv4(), currentChatId, 'assistant', aiResponse);

    res.json({
      chatId: currentChatId,
      response: aiResponse
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

export const getChats = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const chats = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const getMessages = (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC').all(chatId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const getFlatHistory = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const messages = db.prepare(`
      SELECT m.* FROM messages m
      JOIN chats c ON m.chat_id = c.id
      WHERE c.user_id = ?
      ORDER BY m.created_at DESC
      LIMIT 50
    `).all(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getSessions = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const chats = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    
    // Group by date
    const grouped = chats.reduce((acc: any, chat: any) => {
      const date = new Date(chat.created_at).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(chat);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};
