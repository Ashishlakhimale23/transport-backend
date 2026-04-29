"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controller/auth");
const auth_2 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('role').isIn(['admin', 'contractor', 'driver']),
    (0, express_validator_1.body)('username').if((value, { req }) => req.body.role !== 'admin').isLength({ min: 3, max: 25 }),
    (0, express_validator_1.body)('contact').if((value, { req }) => req.body.role !== 'admin').isInt(),
    (0, express_validator_1.body)('regularPracticeLocation').if((value, { req }) => req.body.role !== 'admin').notEmpty(),
    validation_1.validate
], auth_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
    validation_1.validate
], auth_1.login);
router.get('/profile', auth_2.authenticate, auth_1.getProfile);
router.put('/profile', auth_2.authenticate, [
    (0, express_validator_1.body)('username').optional().isLength({ min: 3, max: 25 }),
    (0, express_validator_1.body)('contact').optional().isInt(),
    (0, express_validator_1.body)('regularPracticeLocation').optional().notEmpty(),
    validation_1.validate
], auth_1.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map