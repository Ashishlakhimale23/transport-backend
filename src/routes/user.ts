import { Router } from 'express';
import { body, query, param } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  submitRating,
  getUserRatings
} from '../controller/user';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../utils/types';

const router = Router();

router.get(
  '/',
  authenticate,
  [
    query('role').optional().isIn(['admin', 'contractor', 'driver']),
    validate
  ],
  getAllUsers
);

router.get('/:id', authenticate, getUserById);

/**
router.put(
  '/:id/rating',
  authenticate,
  [
    body('rating').isFloat({ min: 0, max: 5 }),
    validate
  ],
  updateUserRating
);
*/

router.post(
  '/submit-rating',
  authenticate,
  [
    body('ratedUserId').isInt(),
    body('contractId').isInt(),
    body('value').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validate
  ],
  submitRating
);

router.put('/ratings', authenticate, getUserRatings);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;