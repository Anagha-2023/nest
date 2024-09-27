"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 4-digit number
    return otp.toString(); // Convert to string to maintain consistency
};
exports.generateOtp = generateOtp;
