"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bid_1 = require("../controller/bid");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const types_1 = require("../utils/types");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.DRIVER), [
    (0, express_validator_1.body)('contractId').isInt({ min: 1 }).withMessage('Valid contract ID is required'),
    (0, express_validator_1.body)('amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),
    validation_1.validate
], bid_1.createBid);
router.get('/contract/:contractId', auth_1.authenticate, [
    (0, express_validator_1.param)('contractId').isInt({ min: 1 }).withMessage('Valid contract ID is required'),
    validation_1.validate
], bid_1.getBidsByContract);
router.get('/my-bids', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.DRIVER), bid_1.getMyBids);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)(types_1.UserRole.DRIVER), [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Valid bid ID is required'),
    (0, express_validator_1.body)('amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),
    validation_1.validate
], bid_1.updateBid);
router.delete('/:id', auth_1.authenticate, [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Valid bid ID is required'),
    validation_1.validate
], bid_1.deleteBid);
exports.default = router;
//# sourceMappingURL=bid.js.map