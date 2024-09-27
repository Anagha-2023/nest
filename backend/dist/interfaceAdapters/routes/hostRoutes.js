"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hostAuth_1 = require("../controllers/hostControllers/hostAuth");
const router = express_1.default.Router();
router.post('/host-register', hostAuth_1.registerHostController);
router.post('/host-login', hostAuth_1.hostLoginController);
router.post('/google-signin', hostAuth_1.googleHostsignInController);
router.post('/host-googleLogin', hostAuth_1.googleHostLoginController);
router.post('/resend-host-otp', hostAuth_1.resendHostOtp);
router.post('/verify-host-otp', hostAuth_1.verifyOtpController);
exports.default = router;
