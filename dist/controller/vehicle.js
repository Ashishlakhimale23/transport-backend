"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getMyVehicles = exports.createVehicle = void 0;
const database_1 = require("../utils/database");
const createVehicle = async (req, res) => {
    try {
        const { wheelers, category, brand, insuranceValidity } = req.body;
        const vehicle = await database_1.prisma.vehicleType.create({
            data: {
                wheelers,
                category,
                brand,
                insuranceValidity,
                driverId: req.user.id
            },
            include: {
                driver: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};
exports.createVehicle = createVehicle;
const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await database_1.prisma.vehicleType.findMany({
            where: { driverId: req.user.id }
        });
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};
exports.getMyVehicles = getMyVehicles;
const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await database_1.prisma.vehicleType.findUnique({
            where: { id: parseInt(id) },
            include: {
                driver: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        contact: true,
                        rating: true
                    }
                }
            }
        });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
};
exports.getVehicleById = getVehicleById;
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { wheelers, category, brand, insuranceValidity } = req.body;
        const existingVehicle = await database_1.prisma.vehicleType.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        if (existingVehicle.driverId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const vehicle = await database_1.prisma.vehicleType.update({
            where: { id: parseInt(id) },
            data: {
                wheelers,
                category,
                brand,
                insuranceValidity
            }
        });
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await database_1.prisma.vehicleType.findUnique({
            where: { id: parseInt(id) }
        });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        if (vehicle.driverId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await database_1.prisma.vehicleType.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Vehicle deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};
exports.deleteVehicle = deleteVehicle;
//# sourceMappingURL=vehicle.js.map