"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const contract_1 = require("../controller/contract");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const types_1 = require("../utils/types");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.CONTRACTOR), [
    (0, express_validator_1.body)('weight').isFloat({ min: 0 }),
    (0, express_validator_1.body)('pickupDate').isISO8601(),
    (0, express_validator_1.body)('dropDate').isISO8601(),
    (0, express_validator_1.body)('startLocation').notEmpty(),
    (0, express_validator_1.body)('endLocation').notEmpty(),
    (0, express_validator_1.body)('approxKms').isInt({ min: 0 }),
    (0, express_validator_1.body)('typeOfVehicle').isIn(['V4', 'V6', 'V10', 'V12']),
    (0, express_validator_1.body)('insured').isBoolean(),
    (0, express_validator_1.body)('type').isIn(['HANDLE_WITH_CARE', 'AUTOMOBILE']),
    validation_1.validate
], contract_1.createContract);
router.get('/', auth_1.authenticate, [
    (0, express_validator_1.query)('status').optional().isIn(['open', 'assigned']),
    (0, express_validator_1.query)('typeOfVehicle').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    (0, express_validator_1.query)('type').optional().isIn(['HANDLE_WITH_CARE', 'AUTOMOBILE']),
    validation_1.validate
], contract_1.getAllContracts);
router.get('/my-contracts', auth_1.authenticate, contract_1.getMyContracts);
router.get('/:id', auth_1.authenticate, contract_1.getContractById);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.CONTRACTOR), [
    (0, express_validator_1.body)('weight').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('pickupDate').optional().isISO8601(),
    (0, express_validator_1.body)('dropDate').optional().isISO8601(),
    (0, express_validator_1.body)('startLocation').optional().notEmpty(),
    (0, express_validator_1.body)('endLocation').optional().notEmpty(),
    (0, express_validator_1.body)('approxKms').optional().isInt({ min: 0 }),
    (0, express_validator_1.body)('typeOfVehicle').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    (0, express_validator_1.body)('type').optional().isIn(['HANDLE_WITH_CARE', 'AUTOMOBILE']),
    validation_1.validate
], contract_1.updateContract);
router.delete('/:id', auth_1.authenticate, contract_1.deleteContract);
router.post('/:id/assign', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.CONTRACTOR), [
    (0, express_validator_1.body)('goodsCarrierId').isInt(),
    (0, express_validator_1.body)('winningPrice').isInt({ min: 0 }),
    validation_1.validate
], contract_1.assignContract);
exports.default = router;
//# sourceMappingURL=contract.js.map