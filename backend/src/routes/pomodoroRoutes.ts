import { Router } from 'express';
import * as pomodoroController from '../controllers/pomodoroController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/sessions', authenticateToken, pomodoroController.logSession);
router.get('/stats', authenticateToken, pomodoroController.getStats);

export default router;
