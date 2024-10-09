import express from 'express';
import {
  registerHostController,
  googleHostsignInController,
  resendHostOtp,
  verifyOtpController,
  hostLoginController,
  googleHostLoginController,
} from '../controllers/hostControllers/hostAuth';
import { addHomestayController, editHomestayController } from '../controllers/hostControllers/addHomestays';
import { upload } from '../../utils/multer';
import { fetchHomestays } from '../controllers/hostControllers/addHomestays';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/host-register', registerHostController);
router.post('/host-login', hostLoginController);
router.post('/google-signin', googleHostsignInController);
router.post('/host-googleLogin', googleHostLoginController);
router.post('/resend-host-otp', resendHostOtp);
router.post('/verify-host-otp', verifyOtpController);

// Use the MulterRequest type for the addHomestayController
router.post('/addHomestay',authMiddleware('host'), upload.fields([{ name: 'image' }, { name: 'images' }]), addHomestayController);
router.put('/editHomestay/:id',authMiddleware('host'),upload.fields([{name:'image'}, {name:'images'}]), editHomestayController); // Keep this as is if it doesn't involve file uploads
router.get('/getHomestays-host', authMiddleware('host'), fetchHomestays)
export default router;
