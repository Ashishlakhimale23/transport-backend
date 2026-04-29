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
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'contractor', 'driver']),
    body('username').if((value, { req }) => req.body.role !== 'admin').isLength({ min: 3, max: 25 }),
    body('contact').if((value, { req }) => req.body.role !== 'admin').isInt(),
    body('regularPracticeLocation').if((value, { req }) => req.body.role !== 'admin').notEmpty(),
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