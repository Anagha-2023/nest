"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        // Extract the Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        try {
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Log decoded token
            console.log("Decoded token:", decoded);
            console.log("User role:", decoded.user.role);
            // Check if the user role matches the required role
            if (decoded.user.role !== requiredRole) {
                return res.status(403).json({ message: `Access forbidden: Role ${requiredRole} required` });
            }
            // Attach user information to the request
            req.user = decoded.user;
            console.log(req.user);
            next();
        }
        catch (error) {
            console.error("Token verification error:", error); // Log error for verification failure
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
exports.authMiddleware = authMiddleware;
