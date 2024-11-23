"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleHostLoginController = exports.resendHostOtp = exports.googleHostsignInController = exports.hostLoginController = exports.verifyOtpController = exports.registerHostController = void 0;
const Host_1 = __importDefault(require("../../../entities/Host"));
const Otp_1 = __importDefault(require("../../../entities/Otp"));
const otpGenerator_1 = require("../../../utils/otpGenerator");
const emailService_1 = require("../../../services/emailService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register Host Controller
const registerHostController = async (req, res) => {
    const { name, phone, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }
    try {
        const existingHost = await Host_1.default.findOne({ email });
        if (existingHost) {
            return res.status(400).json({ message: 'Host already exists.' });
        }
        const otpCode = (0, otpGenerator_1.generateOtp)();
        console.log("Otp:", otpCode);
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP valid for 3 minutes
        const otpRecord = new Otp_1.default({ email, otp: otpCode, expiresAt });
        await otpRecord.save();
        await (0, emailService_1.sendOtpEmail)(email, otpCode);
        console.log("Otp has been sent to email");
        res.status(200).json({ message: 'OTP sent to email.', host: { name, email, phone, password } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.registerHostController = registerHostController;
// Verify OTP and Register Host
const verifyOtpController = async (req, res) => {
    try {
        const { email, otp, phone, name, password, role } = req.body; // Ensure 'role' is extracted
        // Find the OTP record associated with the email
        const otpRecord = await Otp_1.default.findOne({ email: email.trim().toLowerCase(), otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        // Check if the OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        // Check if the host already exists in the system
        let host = await Host_1.default.findOne({ email });
        // If the host does not exist, create a pending host record and save the password
        if (!host) {
            const hashedPassword = await bcryptjs_1.default.hash(password, 10); // Hash the password
            host = new Host_1.default({
                name,
                email,
                phone,
                password: hashedPassword, // Save the hashed password
                role: role || 'host', // Provide default role if not provided
                verified: true, // Mark as verified immediately after OTP success
                approved: false, // Approved will be handled later by the admin
            });
            await host.save();
            // Remove the OTP record after successful verification
            await Otp_1.default.deleteOne({ _id: otpRecord._id });
            return res.status(200).json({
                message: 'OTP verification success, Registration Pending',
                host: { name: host.name, email: host.email, phone: host.phone, role: host.role, verified: host.verified, approved: host.approved },
                token: jsonwebtoken_1.default.sign({ id: host._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            });
        }
        // If the host exists but is already verified and approved
        if (host.verified && host.approved) {
            return res.status(400).json({ message: "Host already registered, verified, and approved" });
        }
        // If the host exists but is not verified, mark them as verified and pending
        const hashedPassword = await bcryptjs_1.default.hash(password, 10); // Hash the password again if needed
        host.password = hashedPassword; // Update password in the existing record
        host.verified = true; // Mark the host as verified after OTP success
        host.approved = false; // Keep the host as pending approval
        await host.save();
        // Remove the OTP record after successful verification
        await Otp_1.default.deleteOne({ _id: otpRecord._id });
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: host._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: 'OTP verification success, Registration Pending',
            host: { name: host.name, email: host.email, phone: host.phone, role: host.role, verified: host.verified, approved: host.approved },
            token
        });
    }
    catch (error) {
        console.error("Error in OTP verification:", error);
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.verifyOtpController = verifyOtpController;
// Host Login Controller
const hostLoginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const host = await Host_1.default.findOne({ email });
        if (!host) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if (host.isBlocked) {
            return res.status(403).json({ message: 'You are blocked by Admin, You cannot login' });
        }
        if (!host.approved) {
            return res.status(403).json({ message: 'You need admin approval, You cannot login' });
        }
        // Check if password is defined
        if (!password || !host.password) {
            return res.status(401).json({ message: 'Password is required.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, host.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // Include the role in the JWT payload
        const token = jsonwebtoken_1.default.sign({ user: { _id: host._id, role: host.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.hostLoginController = hostLoginController;
// Google Sign-in for Host
const googleHostsignInController = async (req, res) => {
    const { email, name, googleId } = req.body;
    try {
        let host = await Host_1.default.findOne({ email });
        if (host) {
            console.log("Host already exists");
            return res.status(400).json({ message: 'Host already exists with this email.' });
        }
        host = new Host_1.default({
            name,
            email,
            googleId,
            verified: true,
            role: 'host',
            phone: "0000000000",
            password: "google_auth",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await host.save();
        console.log("Host registered successfully via Google", host);
        res.status(201).json({ message: 'Host registered successfully via Google', host });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.googleHostsignInController = googleHostsignInController;
// Resend OTP
const resendHostOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const otpRecord = await Otp_1.default.findOne({ email: email.trim().toLowerCase() });
        if (!otpRecord) {
            return res.status(400).json({ message: 'No OTP request found for this email.' });
        }
        await Otp_1.default.deleteMany({ email: email.trim().toLowerCase() });
        const otpCode = (0, otpGenerator_1.generateOtp)();
        console.log("New OTP:", otpCode);
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        const newOtpRecord = new Otp_1.default({ email, otp: otpCode, expiresAt });
        console.log("New otp Record", newOtpRecord);
        await newOtpRecord.save();
        await (0, emailService_1.sendOtpEmail)(email, otpCode);
        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.resendHostOtp = resendHostOtp;
// Google Login for Host
const googleHostLoginController = async (req, res) => {
    const { email } = req.body;
    try {
        const host = await Host_1.default.findOne({ email });
        if (!host) {
            return res.status(400).json({ message: 'Host not found, please register first.' });
        }
        if (host.isBlocked) {
            return res.status(403).json({ message: "You are blocked by Admin, cannot log in to your account." });
        }
        const token = jsonwebtoken_1.default.sign({ id: host._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.googleHostLoginController = googleHostLoginController;
