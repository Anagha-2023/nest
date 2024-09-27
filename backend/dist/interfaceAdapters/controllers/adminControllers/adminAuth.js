"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleAdminLogin = void 0;
const adminUseCases_1 = require("../../../useCases/adminUseCases");
//Admin login
const handleAdminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { token, admin } = await (0, adminUseCases_1.adminLogin)(email, password);
        res.json({ token, admin });
    }
    catch (err) {
        console.error("Login Error:", err);
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.handleAdminLogin = handleAdminLogin;
const handleLogout = (req, res) => {
    res.status(200).json({ message: 'Admin Logged out successfully' });
};
exports.handleLogout = handleLogout;
