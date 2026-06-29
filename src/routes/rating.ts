import { Router } from 'express';
import {
  getUserRatings
} from '../controller/user';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getUserRatings);

export default router;