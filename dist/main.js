"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const contract_1 = __importDefault(require("./routes/contract"));
const bid_1 = __importDefault(require("./routes/bid"));
const vechile_1 = __importDefault(require("./routes/vechile"));
const user_1 = __importDefault(require("./routes/user"));
const error_1 = require("./middleware/error");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.default);
app.use('/api/contracts', contract_1.default);
app.use('/api/bids', bid_1.default);
app.use('/api/vehicles', vechile_1.default);
app.use('/api/users', user_1.default);
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map