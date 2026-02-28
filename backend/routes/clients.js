import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import validate from '../middleware/validate.js';
import { body, param, query } from 'express-validator';
import * as clientController from '../controllers/clientController.js';

// Create client
router.post(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
  ],
  validate,
  clientController.createClient
);

// Get clients (with search, pagination)
router.get(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  clientController.getClients
);

// Get single client
router.get(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  clientController.getClient
);

// Update client
router.put(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [
    param('id').isMongoId(),
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
  ],
  validate,
  clientController.updateClient
);

// Delete client
router.delete(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  clientController.deleteClient
);

export default router;
