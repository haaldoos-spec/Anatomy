import { Server, Socket } from 'socket.io';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const setupSocketHandlers = (io: Server) => {
  // Map to track user socket connections
  const userSockets = new Map<string, string>(); // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Register user when they connect (they should send their userId)
    socket.on('register', (userId: string) => {
      userSockets.set(userId, socket.id);
      (socket as any).userId = userId;
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      const userId = (socket as any).userId;
      if (userId) {
        userSockets.delete(userId);
      }
      console.log('User disconnected:', socket.id);
    });

    // Challenge Logic
    socket.on('challenge:send', (data: { challengedEmail: string }) => {
      const challengerId = (socket as any).userId;
      if (!challengerId) return;

      try {
        const challenged = db.prepare('SELECT id FROM users WHERE email = ?').get(data.challengedEmail) as any;
        if (!challenged) {
          socket.emit('challenge:error', { message: 'User not found' });
          return;
        }

        if (challenged.id === challengerId) {
          socket.emit('challenge:error', { message: 'You cannot challenge yourself' });
          return;
        }

        const challengeId = uuidv4();
        db.prepare(`
          INSERT INTO challenges (id, challenger_id, challenged_id)
          VALUES (?, ?, ?)
        `).run(challengeId, challengerId, challenged.id);

        const challenger = db.prepare('SELECT full_name FROM users WHERE id = ?').get(challengerId) as any;

        // Notify the challenged user if they are online
        const challengedSocketId = userSockets.get(challenged.id);
        if (challengedSocketId) {
          io.to(challengedSocketId).emit('challenge:received', {
            challengeId,
            challengerId,
            challengerName: challenger.full_name,
          });
        }

        socket.emit('challenge:sent', { challengeId });
      } catch (error) {
        console.error('Challenge send error:', error);
      }
    });

    socket.on('challenge:accept', (data: { challengeId: string }) => {
      const userId = (socket as any).userId;
      if (!userId) return;

      try {
        const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(data.challengeId) as any;
        if (!challenge || challenge.challenged_id !== userId) return;

        db.prepare("UPDATE challenges SET status = 'accepted' WHERE id = ?").run(data.challengeId);

        // Notify challenger
        const challengerSocketId = userSockets.get(challenge.challenger_id);
        if (challengerSocketId) {
          io.to(challengerSocketId).emit('challenge:accepted', { challengeId: data.challengeId });
        }

        // Start game - pick random questions
        const questions = db.prepare('SELECT * FROM questions ORDER BY RANDOM() LIMIT 5').all();
        
        io.to(socket.id).emit('challenge:start', { challengeId: data.challengeId, questions });
        if (challengerSocketId) {
          io.to(challengerSocketId).emit('challenge:start', { challengeId: data.challengeId, questions });
        }
      } catch (error) {
        console.error('Challenge accept error:', error);
      }
    });

    socket.on('challenge:decline', (data: { challengeId: string }) => {
      const userId = (socket as any).userId;
      if (!userId) return;

      try {
        const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(data.challengeId) as any;
        if (!challenge || challenge.challenged_id !== userId) return;

        db.prepare("UPDATE challenges SET status = 'declined' WHERE id = ?").run(data.challengeId);

        const challengerSocketId = userSockets.get(challenge.challenger_id);
        if (challengerSocketId) {
          io.to(challengerSocketId).emit('challenge:declined', { challengeId: data.challengeId });
        }
      } catch (error) {
        console.error('Challenge decline error:', error);
      }
    });

    socket.on('challenge:answer', (data: { challengeId: string, score: number }) => {
      const userId = (socket as any).userId;
      if (!userId) return;

      try {
        const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(data.challengeId) as any;
        if (!challenge) return;

        if (challenge.challenger_id === userId) {
          db.prepare('UPDATE challenges SET challenger_score = ? WHERE id = ?').run(data.score, data.challengeId);
        } else if (challenge.challenged_id === userId) {
          db.prepare('UPDATE challenges SET challenged_score = ? WHERE id = ?').run(data.score, data.challengeId);
        }

        // Notify opponent of progress
        const opponentId = challenge.challenger_id === userId ? challenge.challenged_id : challenge.challenger_id;
        const opponentSocketId = userSockets.get(opponentId);
        if (opponentSocketId) {
          io.to(opponentSocketId).emit('challenge:opponent_score', { 
            challengeId: data.challengeId, 
            opponentScore: data.score 
          });
        }
      } catch (error) {
        console.error('Challenge answer error:', error);
      }
    });

    socket.on('challenge:finish', (data: { challengeId: string, score: number }) => {
        const userId = (socket as any).userId;
        if (!userId) return;
  
        try {
          const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(data.challengeId) as any;
          if (!challenge) return;
  
          if (challenge.challenger_id === userId) {
            db.prepare('UPDATE challenges SET challenger_score = ?, challenger_finished = 1 WHERE id = ?').run(data.score, data.challengeId);
          } else {
            db.prepare('UPDATE challenges SET challenged_score = ?, challenged_finished = 1 WHERE id = ?').run(data.score, data.challengeId);
          }

          // Fetch updated challenge
          const updated = db.prepare('SELECT * FROM challenges WHERE id = ?').get(data.challengeId) as any;
          
          if (updated.challenger_finished === 1 && updated.challenged_finished === 1) {
            // Determine winner
            let winnerId = null;
            if (updated.challenger_score > updated.challenged_score) {
              winnerId = updated.challenger_id;
            } else if (updated.challenged_score > updated.challenger_score) {
              winnerId = updated.challenged_id;
            } // else it's a draw, winnerId remains null

            db.prepare("UPDATE challenges SET status = 'completed', winner_id = ? WHERE id = ?").run(winnerId, data.challengeId);

            // Notify both
            const challengerSocketId = userSockets.get(updated.challenger_id);
            const challengedSocketId = userSockets.get(updated.challenged_id);

            const result = {
              challengeId: data.challengeId,
              challengerScore: updated.challenger_score,
              challengedScore: updated.challenged_score,
              winnerId,
            };

            if (challengerSocketId) io.to(challengerSocketId).emit('challenge:result', result);
            if (challengedSocketId) io.to(challengedSocketId).emit('challenge:result', result);
          } else {
            socket.emit('challenge:result_waiting', { challengeId: data.challengeId });
          }
        } catch (error) {
          console.error('Challenge finish error:', error);
        }
      });
  });
};
