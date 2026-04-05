import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth
  message: "Too many login/register attempts from this IP, please try again in 15 minutes",
});
import {
    registerUser,
    loginUser,
    googleAuth,
    logoutUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleAuth);
router.post('/logout', protect, logoutUser); // Protected logout if you manage sessions/tokens on server

export default router;