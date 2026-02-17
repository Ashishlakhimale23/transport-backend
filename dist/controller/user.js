"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRating = exports.getUserById = exports.getAllUsers = void 0;
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
                rating: true
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
                rating: true,
                contractsCreated: {
                    include: {
                        insurance: true
                    }
                },
                contractsCarried: {
                    include: {
                        insurance: true
                    }
                }
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
const updateUserRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const user = await database_1.prisma.user.update({
            where: { id: parseInt(id) },
            data: { rating },
            select: {
                id: true,
                username: true,
                rating: true
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update rating' });
    }
};
exports.updateUserRating = updateUserRating;
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