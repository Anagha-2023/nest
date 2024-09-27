"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = exports.ForgotPassword = exports.registerUser = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const emailService_1 = require("../services/emailService");
const serverconfig_1 = require("../config/serverconfig");
const loginUser = async (email, password) => {
    try {
        const user = await (0, userRepository_1.findUserByEmail)(email);
        // Check if the user exists and has a password (non-Google users)
        if (user && user.password && (await bcryptjs_1.default.compare(password, user.password))) {
            return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, serverconfig_1.JWT_SECRET, { expiresIn: '1h' });
        }
        return null; // Invalid email/password or no password
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Error logging in user: ' + error.message);
        }
        else {
            throw new Error('Unknown error occurred during login');
        }
    }
};
exports.loginUser = loginUser;
const registerUser = async (name, phone, email, password) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await (0, userRepository_1.createUser)({ name, phone, email, password: hashedPassword, role: 'user' });
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Error registering user: ' + error.message);
        }
        else {
            throw new Error('Unknown error occurred during registration');
        }
    }
};
exports.registerUser = registerUser;
const ForgotPassword = async (email) => {
    const user = await (0, userRepository_1.findUserByEmail)(email);
    if (!user)
        throw new Error('User not found, Please register first');
    if (user.isBlocked)
        throw new Error('User is blocked');
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    //Send Reset Password Link
    await (0, emailService_1.sendResetEmail)(email, resetLink);
    console.log('Reset password mail send successfully');
    return 'Reset password email sent Successfully.';
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = async (email, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword)
        throw new Error('Passwords do not match');
    const user = await (0, userRepository_1.findUserByEmail)(email);
    if (!user)
        throw new Error('User not found');
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    await (0, userRepository_1.updatePassword)(email, hashedPassword);
    return "password Updated Successfully";
};
exports.ResetPassword = ResetPassword;
