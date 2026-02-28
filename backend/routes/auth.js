import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/auth.js';
import { register, login, refresh, me } from '../controllers/authController.js';

// POST /api/auth/register
router.post('/register', register);
// POST /api/auth/login
router.post('/login', login);
// POST /api/auth/refresh
router.post('/refresh', refresh);
// GET /api/auth/me
router.get('/me', authMiddleware, me);

export default router;
