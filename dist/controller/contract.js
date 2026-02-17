"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyContracts = exports.assignContract = exports.deleteContract = exports.updateContract = exports.getContractById = exports.getAllContracts = exports.createContract = void 0;
const database_1 = require("../utils/database");
const createContract = async (req, res) => {
    try {
        const { weight, pickupDate, dropDate, startLocation, endLocation, approxKms, typeOfVehicle, insured, type, insurance, description, requirements, name } = req.body;
        const contract = await database_1.prisma.contract.create({
            data: {
                weight,
                pickupDate: new Date(pickupDate),
                dropDate: new Date(dropDate),
                startLocation,
                endLocation,
                approxKms,
                contractorId: req.user.id,
                typeOfVehicle,
                insured,
                type,
                description,
                requirements,
                insurance: insured && insurance ? {
                    create: {
                        type: insurance.type,
                        premium: insurance.premium
                    }
                } : undefined
            },
            include: {
                insurance: true,
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        rating: true
                    }
                }
            }
        });
        res.status(201).json(contract);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create contract' });
    }
};
exports.createContract = createContract;
const getAllContracts = async (req, res) => {
    try {
        const { status, typeOfVehicle, type } = req.query;
        const where = {};
        if (status === 'open') {
            where.goodsCarrierId = null;
        }
        else if (status === 'assigned') {
            where.goodsCarrierId = { not: null };
        }
        if (typeOfVehicle) {
            where.typeOfVehicle = typeOfVehicle;
        }
        if (type) {
            where.type = type;
        }
        const contracts = await database_1.prisma.contract.findMany({
            where,
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        rating: true
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        rating: true
                    }
                },
                insurance: true,
                bids: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                rating: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(contracts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
};
exports.getAllContracts = getAllContracts;
const getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) },
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        contact: true,
                        rating: true
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        contact: true,
                        rating: true
                    }
                },
                insurance: true,
                bids: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                rating: true
                            }
                        }
                    },
                    orderBy: { amount: 'asc' }
                }
            }
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json(contract);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch contract' });
    }
};
exports.getContractById = getContractById;
const updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { weight, pickupDate, dropDate, startLocation, endLocation, approxKms, typeOfVehicle, type, description, requirements } = req.body;
        const existingContract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingContract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        if (existingContract.contractorId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const contract = await database_1.prisma.contract.update({
            where: { id: parseInt(id) },
            data: {
                weight,
                pickupDate: pickupDate ? new Date(pickupDate) : undefined,
                dropDate: dropDate ? new Date(dropDate) : undefined,
                startLocation,
                endLocation,
                approxKms,
                typeOfVehicle,
                type,
                description,
                requirements
            },
            include: {
                insurance: true,
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        res.json(contract);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update contract' });
    }
};
exports.updateContract = updateContract;
const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) }
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        if (contract.contractorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await database_1.prisma.contract.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Contract deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete contract' });
    }
};
exports.deleteContract = deleteContract;
const assignContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { goodsCarrierId, winningPrice } = req.body;
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) }
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        if (contract.contractorId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updatedContract = await database_1.prisma.contract.update({
            where: { id: parseInt(id) },
            data: {
                goodsCarrierId,
                winningPrice
            },
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        res.json(updatedContract);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to assign contract' });
    }
};
exports.assignContract = assignContract;
const getMyContracts = async (req, res) => {
    try {
        const { type } = req.query;
        const where = {};
        if (type === 'created') {
            where.contractorId = req.user.id;
        }
        else if (type === 'assigned') {
            where.goodsCarrierId = req.user.id;
        }
        else {
            where.OR = [
                { contractorId: req.user.id },
                { goodsCarrierId: req.user.id }
            ];
        }
        const contracts = await database_1.prisma.contract.findMany({
            where,
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                insurance: true,
                bids: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(contracts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
};
exports.getMyContracts = getMyContracts;
//# sourceMappingURL=contract.js.map