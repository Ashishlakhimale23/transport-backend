"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.Status_Mode = exports.VehicleCategory = exports.GoodsType = exports.VehicleWheel = exports.UserRole = void 0;
exports.UserRole = {
    admin: 'admin',
    contractor: 'contractor',
    driver: 'driver'
};
exports.VehicleWheel = {
    V4: '4',
    V6: '6',
    V10: '10',
    V12: '12'
};
exports.GoodsType = {
    HANDLE_WITH_CARE: 'handlewithcare',
    AUTOMOBILE: 'automobile'
};
exports.VehicleCategory = {
    OPEN: 'open',
    SEMIOPEN: 'semiopen',
    CONTAINER: 'container'
};
exports.Status_Mode = {
    PENDING: 'pending',
    ADMIN_APPROVAL: 'admin_approval',
    APPROVED: 'approved',
    DECLINED: 'declined'
};
exports.DeliveryStatus = {
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    COMPLETED: 'completed'
};
//# sourceMappingURL=enums.js.map