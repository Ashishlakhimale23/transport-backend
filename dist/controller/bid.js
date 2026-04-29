"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = exports.approve = exports.pendingBids = exports.deleteBid = exports.updateBid = exports.getMyBids = exports.getBidsByContract = exports.createBid = void 0;
const database_1 = require("../utils/database");
const client_1 = require("../generate/prisma/client");
const email_1 = require("../utils/email");
const createBid = async (req, res) => {
    try {
        const { contractId, amount } = req.body;
        const contract = await database_1.prisma.contract.findUnique({
            where: { id: contractId }
        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        if (contract.contractorId === req.user.id) {
            return res.status(400).json({ error: 'Cannot bid on your own contract' });
        }
        if (contract.goodsCarrierId) {
            return res.status(400).json({ error: 'Contract already assigned' });
        }
        const existingBid = await database_1.prisma.bid.findFirst({
            where: {
                contractId,
                userId: req.user.id
            }
        });
        if (existingBid) {
            return res.status(400).json({ error: 'You have already bid on this contract' });
        }
        const bid = await database_1.prisma.bid.create({
            data: {
                userId: req.user.id,
                contractId,
                amount,
                status: "pending"
            },
        });
        res.status(201).json(bid);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create bid' });
    }
};
exports.createBid = createBid;
const getBidsByContract = async (req, res) => {
    try {
        const { contractId } = req.params;
        const bids = await database_1.prisma.bid.findMany({
            where: { contractId: parseInt(contractId) },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        rating: true,
                        contact: true
                    }
                }
            },
            orderBy: { amount: 'asc' }
        });
        res.json(bids);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
};
exports.getBidsByContract = getBidsByContract;
const getMyBids = async (req, res) => {
    try {
        const bids = await database_1.prisma.bid.findMany({
            where: { userId: req.user.id },
            include: {
                contract: {
                    include: {
                        contractor: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
        res.json(bids);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
};
exports.getMyBids = getMyBids;
const updateBid = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const existingBid = await database_1.prisma.bid.findUnique({
            where: { id: parseInt(id) },
            include: { contract: true }
        });
        if (!existingBid) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        if (existingBid.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        if (existingBid.contract.goodsCarrierId) {
            return res.status(400).json({ error: 'Contract already assigned' });
        }
        const bid = await database_1.prisma.bid.update({
            where: { id: parseInt(id) },
            data: { amount },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        rating: true
                    }
                }
            }
        });
        res.json(bid);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update bid' });
    }
};
exports.updateBid = updateBid;
const deleteBid = async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await database_1.prisma.bid.findUnique({
            where: { id: parseInt(id) },
            include: { contract: true }
        });
        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        if (bid.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        if (bid.contract.goodsCarrierId) {
            return res.status(400).json({ error: 'Cannot delete bid on assigned contract' });
        }
        await database_1.prisma.bid.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Bid deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete bid' });
    }
};
exports.deleteBid = deleteBid;
const pendingBids = async (req, res) => {
    try {
        const bids = await database_1.prisma.bid.findMany({
            where: {
                status: client_1.Status_Mode.ADMIN_APPROVAL,
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                contract: {
                    select: {
                        id: true,
                        type: true,
                        startLocation: true,
                        endLocation: true,
                        approxKms: true,
                        weight: true,
                        typeOfVehicle: true,
                    }
                },
                createdAt: true,
                amount: true,
                id: true,
                status: true
            }
        });
        res.json({ data: bids });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to fetch the pending bids" });
    }
};
exports.pendingBids = pendingBids;
const approve = async (req, res) => {
    try {
        const { id } = req.params;
        const { goodsCarrierId, amount, contractId } = req.body;
        const bid = await database_1.prisma.bid.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                contract: {
                    select: {
                        id: true,
                        startLocation: true,
                        endLocation: true,
                        approxKms: true,
                        weight: true,
                        typeOfVehicle: true
                    }
                }
            }
        });
        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        const updateContract = await database_1.prisma.contract.update({
            where: {
                id: contractId
            }, data: {
                winningPrice: amount,
                goodsCarrierId: goodsCarrierId
            }
        });
        const updateBid = await database_1.prisma.bid.update({
            where: {
                id: Number(id)
            },
            data: {
                status: client_1.Status_Mode.APPROVED
            }
        });
        const emailTemplate = (0, email_1.getBidApprovalEmailTemplate)(bid.user.username, amount, bid.contract.id, bid.contract.startLocation, bid.contract.endLocation, bid.contract.approxKms, bid.contract.weight, bid.contract.typeOfVehicle);
        await (0, email_1.sendEmail)({
            to: bid.user.email,
            subject: `Bid Approved! - Contract #${bid.contract.id}`,
            html: emailTemplate
        });
        res.status(200).json({ success: true, message: "Bid approved and email sent to bidder" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to approve the bid" });
    }
};
exports.approve = approve;
const reject = async (req, res) => {
    try {
        const { bidId } = req.body;
        const updateBid = await database_1.prisma.bid.update({
            where: {
                id: bidId
            },
            data: {
                status: client_1.Status_Mode.PENDING
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "failed to approve the bid" });
    }
};
exports.reject = reject;
//# sourceMappingURL=bid.js.map