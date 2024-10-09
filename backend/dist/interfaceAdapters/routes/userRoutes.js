"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware"); // Middleware to ensure user is authenticated
const userAuth_1 = require("../controllers/userControllers/userAuth");
const router = express_1.default.Router();
router.post('/login', userAuth_1.handleLoginUser);
router.post('/register', userAuth_1.registerUser);
router.post('/verify-otp', userAuth_1.verifyOtp);
router.post('/resend-otp', userAuth_1.resendOtp);
router.post('/forgot-password', userAuth_1.forgotPassword);
router.post('/reset-password', userAuth_1.resetPassword);
router.post('/google-signin', userAuth_1.googleSignIn);
router.post('/google-login', userAuth_1.googleLogin);
// Apply authMiddleware to secure this route
router.get('/check-block-status', (0, authMiddleware_1.authMiddleware)('user'), userAuth_1.checkBlockStatus);
router.get('/homstay-listing', userAuth_1.homestayListing);
//Logout
router.post('/user-logout', userAuth_1.userLogout);
exports.default = router;
