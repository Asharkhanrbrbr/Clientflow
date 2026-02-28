import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import validate from '../middleware/validate.js';
import { body, param, query } from 'express-validator';
import * as projectController from '../controllers/projectController.js';

// Create project
router.post(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('clientId').isMongoId().withMessage('Valid clientId required'),
    body('status').optional().isIn(['active', 'completed', 'on-hold']),
    body('budget').optional().isFloat({ min: 0 }),
    body('deadline').optional().isISO8601(),
  ],
  validate,
  projectController.createProject
);

// Get projects (with filtering by status)
router.get(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    query('status').optional().isIn(['active', 'completed', 'on-hold']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  projectController.getProjects
);

// Get single project
router.get(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  projectController.getProject
);

// Update project
router.put(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [
    param('id').isMongoId(),
    body('name').optional().notEmpty(),
    body('status').optional().isIn(['active', 'completed', 'on-hold']),
    body('budget').optional().isFloat({ min: 0 }),
    body('deadline').optional().isISO8601(),
  ],
  validate,
  projectController.updateProject
);

// Delete project
router.delete(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  projectController.deleteProject
);

export default router;
