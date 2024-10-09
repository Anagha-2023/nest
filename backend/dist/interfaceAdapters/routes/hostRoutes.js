"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hostAuth_1 = require("../controllers/hostControllers/hostAuth");
const addHomestays_1 = require("../controllers/hostControllers/addHomestays");
const multer_1 = require("../../utils/multer");
const addHomestays_2 = require("../controllers/hostControllers/addHomestays");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/host-register', hostAuth_1.registerHostController);
router.post('/host-login', hostAuth_1.hostLoginController);
router.post('/google-signin', hostAuth_1.googleHostsignInController);
router.post('/host-googleLogin', hostAuth_1.googleHostLoginController);
router.post('/resend-host-otp', hostAuth_1.resendHostOtp);
router.post('/verify-host-otp', hostAuth_1.verifyOtpController);
// Use the MulterRequest type for the addHomestayController
router.post('/addHomestay', (0, authMiddleware_1.authMiddleware)('host'), multer_1.upload.fields([{ name: 'image' }, { name: 'images' }]), addHomestays_1.addHomestayController);
router.put('/editHomestay/:id', (0, authMiddleware_1.authMiddleware)('host'), multer_1.upload.fields([{ name: 'image' }, { name: 'images' }]), addHomestays_1.editHomestayController); // Keep this as is if it doesn't involve file uploads
router.get('/getHomestays-host', (0, authMiddleware_1.authMiddleware)('host'), addHomestays_2.fetchHomestays);
exports.default = router;
