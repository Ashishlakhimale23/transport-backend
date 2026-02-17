"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const vehicle_1 = require("../controller/vehicle");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const types_1 = require("../utils/types");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.DRIVER), [
    (0, express_validator_1.body)('wheelers').isIn(['V4', 'V6', 'V10', 'V12']),
    (0, express_validator_1.body)('category').isIn(['OPEN', 'SEMIOPEN', 'CONTAINER']),
    (0, express_validator_1.body)('brand').isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('insuranceValidity').isBoolean(),
    validation_1.validate
], vehicle_1.createVehicle);
router.get('/my-vehicles', auth_1.authenticate, vehicle_1.getMyVehicles);
router.get('/:id', auth_1.authenticate, vehicle_1.getVehicleById);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.DRIVER), [
    (0, express_validator_1.body)('wheelers').optional().isIn(['V4', 'V6', 'V10', 'V12']),
    (0, express_validator_1.body)('category').optional().isIn(['OPEN', 'SEMIOPEN', 'CONTAINER']),
    (0, express_validator_1.body)('brand').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('insuranceValidity').optional().isBoolean(),
    validation_1.validate
], vehicle_1.updateVehicle);
router.delete('/:id', auth_1.authenticate, vehicle_1.deleteVehicle);
exports.default = router;
//# sourceMappingURL=vechile.js.map