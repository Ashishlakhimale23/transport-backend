import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  assignContract,
  getMyContracts,
  confirmDelivery
} from '../controller/contract';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../utils/types';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.CONTRACTOR),
  [
    body('weight').isFloat({ min: 0 }),
    body('pickupDate').isISO8601(),
    body('dropDate').isISO8601(),
    body('startLocation').notEmpty(),
    body('endLocation').notEmpty(),
    body('approxKms').isInt({ min: 0 }),
    body('typeOfVehicle').isIn(['V4', 'V6', 'V10', 'V12']),
    body('insured').isBoolean(),
    body('type').isString().notEmpty(),
    body('description').isString().notEmpty(),
  ],
  createContract
);

router.get(
  '/',
  authenticate,
  [
    query('status').optional().isIn(['open', 'assigned']),
    query('typeOfVehicle').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    query('type'),
    validate
  ],
  getAllContracts
);

router.get('/my-contracts', authenticate, getMyContracts);

router.get('/:id', authenticate, getContractById);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.CONTRACTOR),
  [
    body('weight').optional().isFloat({ min: 0 }),
    body('pickupDate').optional().isISO8601(),
    body('dropDate').optional().isISO8601(),
    body('startLocation').optional().notEmpty(),
    body('endLocation').optional().notEmpty(),
    body('approxKms').optional().isInt({ min: 0 }),
    body('typeOfVehicle').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    body('type'),
    validate
  ],
  updateContract
);

router.delete('/:id', authenticate, deleteContract);

router.post(
  '/:id/assign',
  authenticate,
  authorize(UserRole.CONTRACTOR),
  [
    body('goodsCarrierId').isInt(),
    body('winningPrice').isInt({ min: 0 }),
    validate
  ],
  assignContract
);

router.put(
  '/:id/confirm-delivery',
  authenticate,
  authorize(UserRole.DRIVER),
  [
    body('deliverableNotes').optional().isString(),
    validate
  ],
  confirmDelivery
);

export default router;