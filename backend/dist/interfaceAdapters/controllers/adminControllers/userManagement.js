"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockUser = exports.blockUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../../../entities/User"));
//Fetch All users
const getAllUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8; // Default to 8 users per page
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const users = await User_1.default.find().skip(skip).limit(limit); // Fetch users with pagination
        const totalUsers = await User_1.default.countDocuments(); // Total number of users
        res.status(200).json({
            message: 'Successfully fetched users',
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
//Block User
const blockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("User Id:", userId);
        const user = await User_1.default.findById(userId);
        console.log("User:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.isBlocked = true;
        await user.save();
        console.log("User Blocked Successfully");
        console.log("Blocked User:", user);
        return res.status(200).json({ message: 'User Blocked Successfully', user });
    }
    catch (error) {
        return res.status(500).json({ message: "Error blocking user." });
    }
};
exports.blockUser = blockUser;
//UnBlock User
const unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.isBlocked = false;
        user.save();
        console.log("User unblocked succesfully");
        return res.status(200).json({ message: 'User unblocked Successfully', user });
    }
    catch (error) {
        return res.status(500).json({ message: "Error to unblock user, Internal server error" });
    }
};
exports.unblockUser = unblockUser;
