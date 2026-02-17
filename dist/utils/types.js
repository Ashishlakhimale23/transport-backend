"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceType = exports.VehicleCategory = exports.GoodsType = exports.VehicleWheel = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CONTRACTOR"] = "contractor";
    UserRole["DRIVER"] = "driver";
})(UserRole || (exports.UserRole = UserRole = {}));
var VehicleWheel;
(function (VehicleWheel) {
    VehicleWheel["V4"] = "4";
    VehicleWheel["V6"] = "6";
    VehicleWheel["V10"] = "10";
    VehicleWheel["V12"] = "12";
})(VehicleWheel || (exports.VehicleWheel = VehicleWheel = {}));
var GoodsType;
(function (GoodsType) {
    GoodsType["HANDLE_WITH_CARE"] = "handlewithcare";
    GoodsType["AUTOMOBILE"] = "automobile";
})(GoodsType || (exports.GoodsType = GoodsType = {}));
var VehicleCategory;
(function (VehicleCategory) {
    VehicleCategory["OPEN"] = "open";
    VehicleCategory["SEMIOPEN"] = "semiopen";
    VehicleCategory["CONTAINER"] = "container";
})(VehicleCategory || (exports.VehicleCategory = VehicleCategory = {}));
var InsuranceType;
(function (InsuranceType) {
    InsuranceType["BASIC"] = "basic";
    InsuranceType["PRO"] = "pro";
    InsuranceType["MAXSAVER"] = "maxsaver";
})(InsuranceType || (exports.InsuranceType = InsuranceType = {}));
//# sourceMappingURL=types.js.map