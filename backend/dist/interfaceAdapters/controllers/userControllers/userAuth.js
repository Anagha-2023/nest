"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homestayListing = exports.userLogout = exports.checkBlockStatus = exports.handleLoginUser = exports.googleLogin = exports.resetPassword = exports.forgotPassword = exports.resendOtp = exports.verifyOtp = exports.googleSignIn = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../../entities/User"));
const Otp_1 = __importDefault(require("../../../entities/Otp"));
const emailService_1 = require("../../../services/emailService");
const otpGenerator_1 = require("../../../utils/otpGenerator");
const userUseCases_1 = require("../../../useCases/userUseCases");
const Homestay_1 = __importDefault(require("../../../entities/Homestay"));
// User registration
const registerUser = async (req, res) => {
    const { name, phone, email, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const otpCode = (0, otpGenerator_1.generateOtp)();
        console.log("OTP:", otpCode);
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 3 minutes
        const otpRecord = new Otp_1.default({ email, otp: otpCode, expiresAt });
        await otpRecord.save();
        await (0, emailService_1.sendOtpEmail)(email, otpCode);
        console.log("OTP has been sent to email...", {
            name: name,
            email: email,
            phone: phone,
            password: password
        });
        res.status(200).json({
            message: "OTP sent to Email",
            user: { name, email, phone, password }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.registerUser = registerUser;
//Google register
const googleSignIn = async (req, res) => {
    const { email, name, googleId } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            console.log("User already exist...");
            return res.status(400).json({ message: 'User already Registered with this E-mail.' });
        }
        user = new User_1.default({
            name,
            email,
            googleId,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await user.save();
        console.log("User Registered Succesfully via Google, User Details:", user);
        return res.status(201).json({ message: 'User created Successfully via Google', user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error });
    }
};
exports.googleSignIn = googleSignIn;
// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp, name, password, phone } = req.body;
        console.log("Request body:", req.body);
        console.log("////////////////////");
        const otpRecord = await Otp_1.default.findOne({ email: email.trim().toLowerCase(), otp: otp.trim() });
        console.log("OTP Record:", otpRecord);
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        let user = await User_1.default.findOne({ email });
        if (!user) {
            console.log("Password:", password);
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            console.log("HashedPassword:", hashedPassword);
            user = new User_1.default({
                name,
                email,
                password: hashedPassword,
                phone: phone,
                role: 'user',
                isVerified: true
            });
            await user.save();
            console.log("User registred Successfully:", {
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: hashedPassword
            });
            return res.status(201).json({
                message: 'User Registred Succesfully',
                user: { name: user.name, email: user.email, phone: user.phone, password: hashedPassword }
            });
        }
        else if (user.isVerified) {
            return res.status(400).json({ message: "User is already registered." });
        }
        else {
            user.isVerified = true;
            await user.save();
        }
        await Otp_1.default.deleteOne({ _id: otpRecord._id });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("OTP Verification Successful:", {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password
        });
        res.status(201).json({
            message: 'OTP verification successful, registration complete',
            user: { name: user.name, email: user.email, phone: user.phone, password: user.password },
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.verifyOtp = verifyOtp;
//Resend OTP
const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if an OTP for this email already exists in the OTP collection
        const otpRecord = await Otp_1.default.findOne({ email: email.trim().toLowerCase() });
        console.log("Email to resend OTP:", email);
        if (!otpRecord) {
            return res.status(400).json({ message: 'No OTP request found for this email. Please request an OTP first.' });
        }
        // Invalidate existing OTPs for this email
        await Otp_1.default.deleteMany({ email: email.trim().toLowerCase() });
        // Generate a new OTP
        const otpCode = (0, otpGenerator_1.generateOtp)();
        console.log("New OTP:", otpCode);
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP valid for 3 minutes
        const newOtpRecord = new Otp_1.default({ email: email.trim().toLowerCase(), otp: otpCode, expiresAt });
        await newOtpRecord.save();
        // Send the new OTP via email
        await (0, emailService_1.sendOtpEmail)(email, otpCode);
        console.log("OTP Resend Successful");
        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.resendOtp = resendOtp;
//Forgot Password
const forgotPassword = async (req, res) => {
    console.log("In forgot password...");
    const { email } = req.body;
    console.log("Email entered:", email);
    // Validate email input
    if (!email.trim()) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({ message: 'Invalid email format' });
    }
    try {
        // Assuming ForgotPassword is a function that sends the reset email
        const result = await (0, userUseCases_1.ForgotPassword)(email);
        if (result) {
            return res.status(200).json({ message: 'Reset password email sent successfully' });
        }
        else {
            return res.status(404).json({ message: 'Email not found' });
        }
    }
    catch (error) {
        console.error('Error in forgot password:', error.message);
        if (error.message === 'User not found, Please register first') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'User is blocked') {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
//Reset Password
const resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const authHeader = req.headers.authorization;
    // Check if authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    console.log("Token in backend:", token);
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret not configured' });
    }
    // Check if token is available
    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Ensure decoded is an object and contains the email property
        if (typeof decoded === 'object' && 'email' in decoded) {
            const email = decoded.email;
            console.log("Reset password Email:", email);
            await (0, userUseCases_1.ResetPassword)(email, newPassword, confirmPassword);
            res.status(200).json({ message: 'Password reset successfully' });
        }
        else {
            throw new Error("Token does not contain a valid email.");
        }
    }
    catch (error) {
        console.error("Error in password reset:", error);
        res.status(400).json({ message: error.message });
    }
};
exports.resetPassword = resetPassword;
//Google Login
const googleLogin = async (req, res) => {
    const { email, googleId } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            if (user.isBlocked) {
                return res.status(403).json({ message: "You are blocked by Admin, cannot log in to your account." });
            }
        }
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("User logged In Succesfully", user, token);
            return res.status(200).json({ token, user });
        }
        else {
            console.log("Error in logIn user");
            return res.status(400).json({ message: 'User not found, please register first.' });
        }
    }
    catch (error) {
        console.log("Error for login", error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
exports.googleLogin = googleLogin;
// Login
const handleLoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "You are blocked by Admin, Cannot login to your account." });
        }
        // Check if the user has a password (non-Google users)
        if (!user.password) {
            return res.status(400).json({ message: 'This account is registered via Google. Please use Google Sign-In.' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ user: { _id: user._id, role: user.role } }, //included role in payload
        process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.handleLoginUser = handleLoginUser;
const checkBlockStatus = async (req, res) => {
    console.log("Check block status route hit//////////");
    try {
        // Ensure req.user is populated by authMiddleware
        const userId = req.user._id;
        const user = await User_1.default.findById(userId);
        console.log("userId:", userId);
        if (!user || user.isBlocked === undefined) {
            return res.status(404).json({ message: 'User not found or block status unknown' });
        }
        return res.status(200).json({ isBlocked: user.isBlocked });
    }
    catch (error) {
        console.error('Failed to check user block status:', error);
        return res.status(500).json({ message: 'Failed to check block status' });
    }
};
exports.checkBlockStatus = checkBlockStatus;
const userLogout = (req, res) => {
    console.log("User logged out successfully");
    res.status(200).json({ message: "User logged out successfully" });
};
exports.userLogout = userLogout;
const homestayListing = async (req, res) => {
    try {
        const homestays = await Homestay_1.default.find().populate('host', 'name'); // Populate host name
        return res.status(200).json(homestays);
    }
    catch (error) {
        console.error('Error fetching homestays:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.homestayListing = homestayListing;
