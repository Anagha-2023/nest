import express from 'express';
import {
  registerHostController,
  googleHostsignInController,
  resendHostOtp,
  verifyOtpController,
  hostLoginController,
  googleHostLoginController
} from '../controllers/hostControllers/hostAuth';

const router = express.Router();

router.post('/host-register', registerHostController);
router.post('/host-login', hostLoginController);
router.post('/google-signin', googleHostsignInController);
router.post('/host-googleLogin', googleHostLoginController);
router.post('/resend-host-otp', resendHostOtp);
router.post('/verify-host-otp', verifyOtpController);

export default router;
