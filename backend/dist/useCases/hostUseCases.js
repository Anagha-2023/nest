"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editHomestayUsecases = exports.getHomestays = exports.addHomestayUsecases = exports.googleSignInUseCase = exports.resendOtpUseCase = exports.verifyOtpAndRegisterHostUseCase = exports.registerHostUseCase = exports.loginHostUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const serverconfig_1 = require("../config/serverconfig");
const hostRepository_1 = require("../repositories/hostRepository");
const otpService_1 = require("../services/otpService");
const Otp_1 = __importDefault(require("../entities/Otp"));
const Host_1 = __importDefault(require("../entities/Host"));
const hostRepository_2 = require("../repositories/hostRepository");
const hostRepository_3 = require("../repositories/hostRepository");
// Use case to register host with OTP validation
const loginHostUseCase = async (email, password) => {
    const host = await (0, hostRepository_1.findHostByEmail)(email);
    if (!host || !host.password || !(await bcryptjs_1.default.compare(password, host.password))) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ id: host._id }, serverconfig_1.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
exports.loginHostUseCase = loginHostUseCase;
// Use case to register host with OTP validation
const registerHostUseCase = async (hostData) => {
    const { email, password, name } = hostData;
    const existingHost = await (0, hostRepository_1.findHostByEmail)(email);
    if (existingHost) {
        throw new Error('Host already registered');
    }
    const otp = await otpService_1.otpService.sendOtp(email);
    return { email, otp };
};
exports.registerHostUseCase = registerHostUseCase;
// Verifying OTP and completing host registration
const verifyOtpAndRegisterHostUseCase = async (email, otp, name, password) => {
    const otpRecord = await Otp_1.default.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
        throw new Error('Invalid or expired OTP');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const host = new Host_1.default({ name, email, password: hashedPassword, verified: true });
    await host.save();
    await Otp_1.default.deleteOne({ _id: otpRecord._id });
    return host;
};
exports.verifyOtpAndRegisterHostUseCase = verifyOtpAndRegisterHostUseCase;
// Resend OTP to the host
const resendOtpUseCase = async (email) => {
    await Otp_1.default.deleteMany({ email });
    const otpCode = await otpService_1.otpService.sendOtp(email);
    return otpCode;
};
exports.resendOtpUseCase = resendOtpUseCase;
// Google sign-in use case
const googleSignInUseCase = async (email, name, googleId) => {
    let host = await Host_1.default.findOne({ email });
    if (host) {
        const token = jsonwebtoken_1.default.sign({ id: host._id }, serverconfig_1.JWT_SECRET, { expiresIn: '1h' });
        return { token, host };
    }
    host = new Host_1.default({ name, email, googleId, verified: true });
    await host.save();
    const token = jsonwebtoken_1.default.sign({ id: host._id }, serverconfig_1.JWT_SECRET, { expiresIn: '1h' });
    return { token, host };
};
exports.googleSignInUseCase = googleSignInUseCase;
// Updated addHomestayUsecases to accept 3 parameters
const addHomestayUsecases = async (homestayDetails, mainImage, additionalImages) => {
    try {
        homestayDetails.image = mainImage ? mainImage.path : '';
        homestayDetails.images = additionalImages.map(img => img.path);
        const newHomestay = await (0, hostRepository_2.addHomestay)(homestayDetails);
        console.log("Successfully Added Homestays:", newHomestay);
        return newHomestay;
    }
    catch (error) {
        console.error("Error in addHomestayUsecases:", error);
        if (error instanceof Error) {
            throw new Error('Error adding homestay in useCases: ' + error.message);
        }
        else {
            throw new Error('An unknown error occurred while adding homestay');
        }
    }
};
exports.addHomestayUsecases = addHomestayUsecases;
const getHomestays = async (hostId) => {
    return await (0, hostRepository_3.findHomestaysByHost)(hostId);
};
exports.getHomestays = getHomestays;
const editHomestayUsecases = async (homestayId, updatedDetails) => {
    const updatedHomestay = await (0, hostRepository_1.editHomestay)(homestayId, updatedDetails);
    return updatedHomestay;
};
exports.editHomestayUsecases = editHomestayUsecases;
