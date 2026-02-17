"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.InsuranceScalarFieldEnum = exports.VehicleTypeScalarFieldEnum = exports.BidScalarFieldEnum = exports.ContractScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Contract: 'Contract',
    Bid: 'Bid',
    VehicleType: 'VehicleType',
    Insurance: 'Insurance'
};
exports.TransactionIsolationLevel = {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    username: 'username',
    role: 'role',
    password: 'password',
    contact: 'contact',
    regularPracticeLocation: 'regularPracticeLocation',
    rating: 'rating'
};
exports.ContractScalarFieldEnum = {
    id: 'id',
    weight: 'weight',
    pickupDate: 'pickupDate',
    dropDate: 'dropDate',
    startLocation: 'startLocation',
    endLocation: 'endLocation',
    approxKms: 'approxKms',
    contractorId: 'contractorId',
    goodsCarrierId: 'goodsCarrierId',
    typeOfVehicle: 'typeOfVehicle',
    insured: 'insured',
    winningPrice: 'winningPrice',
    type: 'type',
    createdAt: 'createdAt',
    description: 'description',
    requirements: 'requirements'
};
exports.BidScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    contractId: 'contractId',
    amount: 'amount'
};
exports.VehicleTypeScalarFieldEnum = {
    id: 'id',
    wheelers: 'wheelers',
    category: 'category',
    brand: 'brand',
    insuranceValidity: 'insuranceValidity',
    driverId: 'driverId'
};
exports.InsuranceScalarFieldEnum = {
    id: 'id',
    contractId: 'contractId',
    type: 'type',
    premium: 'premium'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map