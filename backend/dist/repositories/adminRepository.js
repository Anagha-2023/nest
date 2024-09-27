"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAdminByEmail = void 0;
const Admin_1 = __importDefault(require("../entities/Admin"));
const findAdminByEmail = async (email) => {
    try {
        console.log(`Searching for admin with email: ${email}`);
        const admin = await Admin_1.default.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
        console.log(`Found admin: ${admin}`);
        return admin;
    }
    catch (error) {
        console.error('Error executing findAdminByEmail:', error);
        throw error;
    }
};
exports.findAdminByEmail = findAdminByEmail;
