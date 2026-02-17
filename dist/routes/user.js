"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_1 = require("../controller/user");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const types_1 = require("../utils/types");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, [
    (0, express_validator_1.query)('role').optional().isIn(['admin', 'contractor', 'driver']),
    validation_1.validate
], user_1.getAllUsers);
router.get('/:id', auth_1.authenticate, user_1.getUserById);
router.put('/:id/rating', auth_1.authenticate, [
    (0, express_validator_1.body)('rating').isFloat({ min: 0, max: 5 }),
    validation_1.validate
], user_1.updateUserRating);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.ADMIN), user_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map