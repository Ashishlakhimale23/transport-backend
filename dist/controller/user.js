"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserRatings = exports.submitRating = exports.getUserById = exports.getAllUsers = void 0;
const database_1 = require("../utils/database");
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const where = {};
        if (role) {
            where.role = role;
        }
        const users = await database_1.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                contact: true,
                regularPracticeLocation: true,
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database_1.prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                contact: true,
                regularPracticeLocation: true,
                contractsCreated: true,
                contractsCarried: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserById = getUserById;
const submitRating = async (req, res) => {
    try {
        const { ratedUserId, contractId, value, comment } = req.body;
        const raterId = req.user.id;
        if (!ratedUserId || !contractId || !value) {
            return res.status(400).json({ error: 'Missing required fields: ratedUserId, contractId, value' });
        }
        if (value < 1 || value > 5) {
            return res.status(400).json({ error: 'Rating value must be between 1 and 5' });
        }
        if (comment && comment.length > 500) {
            return res.status(400).json({ error: 'Comment cannot exceed 500 characters' });
        }
        if (raterId === parseInt(ratedUserId)) {
            return res.status(400).json({ error: 'Cannot rate yourself' });
        }
        const existingRating = await database_1.prisma.rating.findFirst({
            where: {
                raterId: raterId,
                ratedUserId: parseInt(ratedUserId),
                contractId: parseInt(contractId)
            }
        });
        if (existingRating) {
            const updatedRating = await database_1.prisma.rating.update({
                where: { id: existingRating.id },
                data: {
                    value,
                    comment: comment || null
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Rating updated successfully',
                rating: updatedRating
            });
        }
        const newRating = await database_1.prisma.rating.create({
            data: {
                raterId: raterId,
                ratedUserId: parseInt(ratedUserId),
                contractId: parseInt(contractId),
                value,
                comment: comment || null
            }
        });
        res.status(201).json({
            success: true,
            message: 'Rating submitted successfully',
            rating: newRating
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};
exports.submitRating = submitRating;
const getUserRatings = async (req, res) => {
    try {
        const { userId } = req.params;
        const ratings = await database_1.prisma.rating.findMany({
            where: { ratedUserId: parseInt(userId) },
            include: {
                rater: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
            : 0;
        res.json({
            userId: parseInt(userId),
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalRatings: ratings.length,
            ratings
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
};
exports.getUserRatings = getUserRatings;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map