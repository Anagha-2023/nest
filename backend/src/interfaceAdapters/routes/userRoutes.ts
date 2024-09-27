import express from 'express';
// import { authMiddleware } from '../../middlewares/authMiddleware';
import {

  registerUser, 
  handleLoginUser, 
  verifyOtp, 
  resendOtp, 
  googleSignIn, 
  googleLogin,
  forgotPassword,
  resetPassword,
  

} from '../controllers/userControllers/userAuth';

const router = express.Router();


router.post('/login', handleLoginUser);

router.post('/register', registerUser);

router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.post('/google-signin', googleSignIn)
router.post('/google-login', googleLogin)




export default router;