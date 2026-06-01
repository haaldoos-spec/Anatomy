import { Router } from 'express';
import * as subscriptionController from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-checkout', authenticateToken, subscriptionController.createCheckoutSession);
router.get('/status', authenticateToken, subscriptionController.getSubscriptionStatus);
router.get('/portal', authenticateToken, subscriptionController.createPortalSession);
router.post('/webhook', subscriptionController.handleWebhook);

export default router;
