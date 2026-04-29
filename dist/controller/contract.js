"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmDelivery = exports.getMyContracts = exports.assignContract = exports.deleteContract = exports.updateContract = exports.getContractById = exports.getAllContracts = exports.createContract = void 0;
const database_1 = require("../utils/database");
const enums_1 = require("../generate/prisma/enums");
const email_1 = require("../utils/email");
const createContract = async (req, res) => {
    try {
        const { weight, pickupDate, dropDate, startLocation, endLocation, approxKms, typeOfVehicle, insured, type, description, requirements, } = req.body;
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
            },
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
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
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                },
                bids: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
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
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
};
exports.getAllContracts = getAllContracts;
const getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        console.log(id);
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) },
            include: {
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        contact: true,
                        _count: {
                            select: {
                                contractsCreated: true
                            }
                        }
                    }
                },
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        contact: true,
                    }
                },
                bids: {
                    select: {
                        amount: true,
                        user: true,
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
        console.log(error);
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
        const getBidID = await database_1.prisma.bid.findFirst({
            where: {
                contractId: parseInt(id),
                userId: goodsCarrierId,
                amount: winningPrice
            },
        });
        if (!getBidID)
            return res.json({ message: "no bid has been found" });
        const updateBid = await database_1.prisma.bid.update({
            where: {
                id: getBidID.id
            }, data: {
                status: enums_1.Status_Mode.ADMIN_APPROVAL
            }
        });
        res.json(updateBid);
    }
    catch (error) {
        console.log(error);
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
const confirmDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliverableNotes } = req.body;
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: parseInt(id) },
            include: {
                goodsCarrier: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                contractor: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        if (contract.goodsCarrierId !== req.user.id) {
            return res.status(403).json({ error: 'Only the assigned driver can confirm delivery' });
        }
        if (!contract.goodsCarrierId) {
            return res.status(400).json({ error: 'Contract is not assigned to any driver' });
        }
        if (contract.deliveryStatus === 'DELIVERED') {
            return res.status(400).json({ error: 'Delivery has already been confirmed' });
        }
        const updatedContract = await database_1.prisma.contract.update({
            where: { id: parseInt(id) },
            data: {
                deliveryStatus: 'DELIVERED',
                deliveryConfirmedAt: new Date(),
                deliverableNotes: deliverableNotes || ''
            }
        });
        const admins = await database_1.prisma.user.findMany({
            where: { role: 'admin' },
            select: { email: true, username: true }
        });
        if (admins.length === 0) {
            return res.status(500).json({ error: 'No admin found to notify' });
        }
        const emailTemplate = (0, email_1.getDeliveryConfirmationEmailTemplate)(contract.contractor.username, contract.id, contract.goodsCarrier.username, contract.winningPrice || 0, contract.startLocation, contract.endLocation, contract.approxKms, contract.weight, contract.typeOfVehicle, deliverableNotes || '');
        for (const admin of admins) {
            await (0, email_1.sendEmail)({
                to: admin.email,
                subject: `Delivery Confirmed - Contract #${contract.id}`,
                html: emailTemplate
            });
        }
        res.status(200).json({
            success: true,
            message: 'Delivery confirmed and email notification sent to admin',
            contract: updatedContract
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to confirm delivery' });
    }
};
exports.confirmDelivery = confirmDelivery;
//# sourceMappingURL=contract.js.map