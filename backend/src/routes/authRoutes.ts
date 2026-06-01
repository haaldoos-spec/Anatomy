import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe);

export default router;
