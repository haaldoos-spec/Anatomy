import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, chatController.handleChat);
router.get('/', authenticateToken, chatController.getChats);
router.get('/history', authenticateToken, chatController.getFlatHistory);
router.get('/sessions', authenticateToken, chatController.getSessions);
router.get('/:chatId/messages', authenticateToken, chatController.getMessages);

export default router;
