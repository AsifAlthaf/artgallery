import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    googleAuth,
    logoutUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/logout', protect, logoutUser); // Protected logout if you manage sessions/tokens on server

export default router;