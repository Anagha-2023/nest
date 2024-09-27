"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminRepository_1 = require("../repositories/adminRepository");
const adminLogin = async (email, password) => {
    // Find the admin by email
    const admin = await (0, adminRepository_1.findAdminByEmail)(email);
    // Check if the admin exists
    if (!admin) {
        throw new Error('Admin not found');
    }
    // Check if the role is 'admin'
    if (admin.role !== 'admin') {
        throw new Error('Unauthorized: You are not an admin');
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcryptjs_1.default.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    // Create the JWT payload
    const payload = {
        user: {
            id: admin._id,
            role: admin.role,
        },
    };
    // Generate the JWT token
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, admin };
};
exports.adminLogin = adminLogin;
