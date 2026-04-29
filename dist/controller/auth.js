"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const database_1 = require("../utils/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const admin_email = process.env.ADMIN_EMAIL;
const register = async (req, res) => {
    try {
        const { email, username, password, role, contact, regularPracticeLocation } = req.body;
        if (role == "admin" && email != admin_email) {
            return res.status(500).json({ error: 'Invalid admin email' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        let user;
        if (role == "admin") {
            user = await database_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    username: "",
                    contact: "455445",
                    regularPracticeLocation: ""
                },
                select: {
                    id: true,
                    email: true,
                    role: true
                }
            });
        }
        else {
            user = await database_1.prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    role,
                    contact,
                    regularPracticeLocation
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (role == "admin" && email != admin_email) {
            res.status(500).json({ error: 'Invalid admin email' });
        }
        const user = await database_1.prisma.user.findFirst({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ error: 'user doesnt exists' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    const user = await database_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            contact: true,
            regularPracticeLocation: true,
            contractsCreated: {
                select: {
                    pickupDate: true,
                    startLocation: true,
                    endLocation: true,
                    weight: true,
                    deliveryStatus: true,
                    goodsCarrier: true,
                    approxKms: true,
                    id: true,
                    type: true,
                    bids: {
                        select: {
                            user: true,
                            status: true,
                            amount: true,
                            createdAt: true,
                        }
                    },
                    winningPrice: true
                }
            },
            bids: {
                select: {
                    status: true,
                    id: true,
                    contractId: true,
                    contract: {
                        select: {
                            startLocation: true,
                            endLocation: true,
                            type: true,
                            typeOfVehicle: true,
                        }
                    },
                    amount: true,
                    createdAt: true
                }
            }
        }
    });
    if (!user) {
        return res.json({ message: "Failed to fetch the user" });
    }
    res.json(user);
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { username, contact, regularPracticeLocation } = req.body;
        const user = await database_1.prisma.user.update({
            where: { id: req.user.id },
            data: { username, contact, regularPracticeLocation },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                contact: true,
                regularPracticeLocation: true,
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=auth.js.map