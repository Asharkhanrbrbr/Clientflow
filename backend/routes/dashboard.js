import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import * as dashboardController from '../controllers/dashboardController.js';

// GET /api/dashboard/summary
router.get('/summary', auth, roles('admin', 'freelancer'), dashboardController.getSummary);

export default router;
