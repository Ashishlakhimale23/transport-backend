import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controller/auth';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('username').isLength({ min: 3, max: 25 }),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'contractor', 'driver']),
    body('contact').isInt(),
    body('regularPracticeLocation').notEmpty(),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
    validate
  ],
  login
);

router.get('/profile', authenticate, getProfile);

router.put(
  '/profile',
  authenticate,
  [
    body('username').optional().isLength({ min: 3, max: 25 }),
    body('contact').optional().isInt(),
    body('regularPracticeLocation').optional().notEmpty(),
    validate
  ],
  updateProfile
);

export default router;