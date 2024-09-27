"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = void 0;
const otpGenerator_1 = require("../utils/otpGenerator");
const emailService_1 = require("./emailService");
exports.otpService = {
    async sendOtp(email) {
        const otp = (0, otpGenerator_1.generateOtp)();
        await (0, emailService_1.sendOtpEmail)(email, otp); // Send OTP via email
        return otp; // Return OTP to store for verification
    }
};
