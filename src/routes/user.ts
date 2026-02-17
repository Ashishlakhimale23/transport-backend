import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUserRating,
  deleteUser
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

router.put(
  '/:id/rating',
  authenticate,
  [
    body('rating').isFloat({ min: 0, max: 5 }),
    validate
  ],
  updateUserRating
);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;