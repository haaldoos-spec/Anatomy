import { Router } from 'express';
import * as challengeController from '../controllers/challengeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/leaderboard', authenticateToken, challengeController.getLeaderboard);
router.get('/history', authenticateToken, challengeController.getHistory);

export default router;
