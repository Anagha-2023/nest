"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../entities/User"));
const Admin_1 = __importDefault(require("../entities/Admin"));
const Host_1 = __importDefault(require("../entities/Host"));
const authMiddleware = (role) => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, Please login' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded || decoded.role !== role) {
                return res.status(403).json({ message: "Access forbidden: Incorrect role" });
            }
            let user;
            if (role === 'user') {
                user = await User_1.default.findById(decoded.user._id).select('isBlocked');
            }
            else if (role === 'host') {
                user = await Host_1.default.findById(decoded.user._id).select('isBlocked');
            }
            else if (role === 'admin') {
                user = await Admin_1.default.findById(decoded.user._id); // No need to check isBlocked for Admin
            }
            // Check if user or host is blocked
            if ((role === 'user' || role === 'host') && user && user.isBlocked) {
                return res.status(403).json({ message: 'Access forbidden: User blocked' });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = decoded.user;
            next();
        }
        catch (err) {
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
    };
};
exports.default = authMiddleware;
