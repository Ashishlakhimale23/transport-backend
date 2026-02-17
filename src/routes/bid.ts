import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBid,
  getBidsByContract,
  getMyBids,
  updateBid,
  deleteBid
} from '../controller/bid';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../utils/types';

const router = Router();

// Create a new bid (only drivers)
router.post(
  '/',
  authenticate,
  authorize(UserRole.DRIVER),
  [
    body('contractId').isInt({ min: 1 }).withMessage('Valid contract ID is required'),
    body('amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),
    validate
  ],
  createBid
);

// Get all bids for a specific contract
router.get(
  '/contract/:contractId',
  authenticate,
  [
    param('contractId').isInt({ min: 1 }).withMessage('Valid contract ID is required'),
    validate
  ],
  getBidsByContract
);

// Get all bids made by the authenticated user
router.get('/my-bids', authenticate, authorize(UserRole.DRIVER), getMyBids);

// Update a specific bid
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.DRIVER),
  [
    param('id').isInt({ min: 1 }).withMessage('Valid bid ID is required'),
    body('amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),
    validate
  ],
  updateBid
);

// Delete a specific bid
router.delete(
  '/:id',
  authenticate,
  [
    param('id').isInt({ min: 1 }).withMessage('Valid bid ID is required'),
    validate
  ],
  deleteBid
);

export default router;