import { Router } from 'express';
import * as quizController from '../controllers/quizController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/questions', authenticateToken, quizController.getQuestions);
router.post('/submit', authenticateToken, quizController.submitQuiz);
router.get('/progress', authenticateToken, quizController.getProgress);

export default router;
