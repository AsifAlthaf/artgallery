import express from 'express';
const router = express.Router();
import {
    createCheckoutSession,
    stripeWebhook,
    getStripeConfig
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to create a Stripe checkout session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Route for Stripe webhooks (no 'protect' middleware as Stripe sends directly)
// IMPORTANT: This route needs to be a raw body parser, typically handled in server.js
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

// Route to get Stripe publishable key
router.get('/config', getStripeConfig);

export default router;