import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import roles from '../middleware/roles.js';
import validate from '../middleware/validate.js';
import { body, param, query } from 'express-validator';
import * as invoiceController from '../controllers/invoiceController.js';

// Create invoice
router.post(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    body('projectId').isMongoId().withMessage('Valid projectId required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount required'),
    body('issueDate').isISO8601().withMessage('Valid issueDate required'),
    body('dueDate').isISO8601().withMessage('Valid dueDate required'),
    body('status').optional().isIn(['paid', 'unpaid', 'overdue']),
  ],
  validate,
  invoiceController.createInvoice
);

// Get invoices (with pagination)
router.get(
  '/',
  auth,
  roles('admin', 'freelancer'),
  [
    query('status').optional().isIn(['paid', 'unpaid', 'overdue']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  invoiceController.getInvoices
);

// Get single invoice
router.get(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  invoiceController.getInvoice
);

// Update invoice
router.put(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [
    param('id').isMongoId(),
    body('status').optional().isIn(['paid', 'unpaid', 'overdue']),
    body('amount').optional().isFloat({ min: 0 }),
    body('dueDate').optional().isISO8601(),
  ],
  validate,
  invoiceController.updateInvoice
);

// Delete invoice
router.delete(
  '/:id',
  auth,
  roles('admin', 'freelancer'),
  [param('id').isMongoId()],
  validate,
  invoiceController.deleteInvoice
);

export default router;
