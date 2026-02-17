import { Router } from 'express';
import { body } from 'express-validator';
import {
  createVehicle,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from "../controller/vehicle";
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../utils/types';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.DRIVER),
  [
    body('wheelers').isIn(['V4', 'V6', 'V10', 'V12']),
    body('category').isIn(['OPEN', 'SEMIOPEN', 'CONTAINER']),
    body('brand').isLength({ min: 1, max: 50 }),
    body('insuranceValidity').isBoolean(),
    validate
  ],
  createVehicle
);

router.get('/my-vehicles', authenticate, getMyVehicles);

router.get('/:id', authenticate, getVehicleById);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.DRIVER),
  [
    body('wheelers').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    body('category').optional().isIn(['OPEN', 'SEMIOPEN', 'CONTAINER']),
    body('brand').optional().isLength({ min: 1, max: 50 }),
    body('insuranceValidity').optional().isBoolean(),
    validate
  ],
  updateVehicle
);

router.delete('/:id', authenticate, deleteVehicle);

export default router;