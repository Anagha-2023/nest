import express from 'express';
import  {authMiddleware}  from '../../middlewares/authMiddleware'; // Middleware to ensure user is authenticated

import {
  registerUser, 
  handleLoginUser, 
  verifyOtp, 
  resendOtp, 
  googleSignIn, 
  googleLogin,
  forgotPassword,
  resetPassword,
  checkBlockStatus,
  userLogout,
  homestayListing,
} from '../controllers/userControllers/userAuth';

const router = express.Router();

router.post('/login', handleLoginUser);
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-signin', googleSignIn);
router.post('/google-login', googleLogin);

// Apply authMiddleware to secure this route
router.get('/check-block-status', authMiddleware('user'), checkBlockStatus);

router.get('/homstay-listing', homestayListing)

//Logout
router.post('/user-logout', userLogout)

export default router;
