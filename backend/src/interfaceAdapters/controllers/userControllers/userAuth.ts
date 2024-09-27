import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../entities/User';
import Otp from '../../../entities/Otp';
import { sendOtpEmail } from '../../../services/emailService';
import { generateOtp } from '../../../utils/otpGenerator';
import {ForgotPassword, ResetPassword} from '../../../useCases/userUseCases'
import { JwtPayload } from 'jsonwebtoken';


// User registration
export const registerUser = async (req: Request, res: Response) => {
  const { name,phone,  email, password, confirmPassword } = req.body;
  
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otpCode = generateOtp();
    console.log("OTP:",otpCode);
    
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 3 minutes
    const otpRecord = new Otp({ email, otp: otpCode, expiresAt });
    await otpRecord.save();

    await sendOtpEmail(email, otpCode);
    console.log("OTP has been sent to email...",{
      name:name,
      email:email,
      phone: phone,
      password: password
    });
    
    res.status(200).json({ 
      message:"OTP sent to Email",
      user:{name, email, phone, password}
     });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//Google register

export const googleSignIn = async (req:Request, res: Response) => {
  const { email, name, googleId } = req.body;

  try {
    let user = await User.findOne({ email });
    if(user){
      console.log("User already exist...");
      
      return res.status(400).json({message:'User already Registered with this E-mail.'})
    }

    user = new User ({
      name,
      email,
      googleId,
      isVerified:true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await user.save();
    console.log("User Registered Succesfully via Google, User Details:", user);
    
    return res.status(201).json({ message: 'User created Successfully via Google', user })
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server error', error })
  }
}



// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  
  try {
    const { email, otp, name, password, phone } = req.body;
    console.log("Request body:", req.body);
    console.log("////////////////////");
    
    const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase(), otp: otp.trim() });
    console.log("OTP Record:", otpRecord);
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log("Password:", password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("HashedPassword:", hashedPassword);

      user = new User({
        name,
        email,
        password: hashedPassword,
        phone:phone,
        role:'user',
        isVerified: true
      })
      await user.save();

      console.log("User registred Successfully:", {
        name: user.name,
        email:user.email,
        phone:user.phone,
        password: hashedPassword
      });

      return res.status(201).json({
        message:'User Registred Succesfully',
        user:{name:user.name, email: user.email, phone:user.phone, password: hashedPassword }
      })
      

    }else if(user.isVerified){
      return res.status(400).json({message:"User is already registered."})
    }else{
      user.isVerified = true;
      await user.save()
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    console.log("OTP Verification Successful:", {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password:user.password
    });
    
    res.status(201).json({ 
      message: 'OTP verification successful, registration complete', 
      user: { name: user.name, email: user.email, phone: user.phone , password:user.password },
      token 
    });

  } catch (error) {
    console.log((error as Error));
    res.status(500).json({ message: 'Server error', error });
  }
};

//Resend OTP

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if an OTP for this email already exists in the OTP collection
    const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase() });
    console.log("Email to resend OTP:", email);

    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP request found for this email. Please request an OTP first.' });
    }

    // Invalidate existing OTPs for this email
    await Otp.deleteMany({ email: email.trim().toLowerCase() });

    // Generate a new OTP
    const otpCode = generateOtp();
    console.log("New OTP:", otpCode);

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP valid for 3 minutes
    const newOtpRecord = new Otp({ email: email.trim().toLowerCase(), otp: otpCode, expiresAt });
    await newOtpRecord.save();

    // Send the new OTP via email
    await sendOtpEmail(email, otpCode);
    console.log("OTP Resend Successful");
    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//Forgot Password

export const forgotPassword = async(req: Request, res: Response) => {
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
    const result = await ForgotPassword(email);

    if (result) {
      return res.status(200).json({ message: 'Reset password email sent successfully' });
    } else {
      return res.status(404).json({ message: 'Email not found' });
    }

  } catch (error: any) {
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


//Reset Password
export const resetPassword = async (req: Request, res: Response) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload | string;

    // Ensure decoded is an object and contains the email property
    if (typeof decoded === 'object' && 'email' in decoded) {
      const email = (decoded as { email: string }).email;
      console.log("Reset password Email:", email);

      await ResetPassword(email, newPassword, confirmPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } else {
      throw new Error("Token does not contain a valid email.");
    }

  } catch (error) {
    console.error("Error in password reset:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};


//Google Login
export const googleLogin = async(req:Request, res:Response) => {
  const {email, googleId} = req.body;

  try {
    let user = await User.findOne({ email });
    if(user){
      if (user.isBlocked) {
        return res.status(403).json({ message: "You are blocked by Admin, cannot log in to your account." });
      }
    }
    
    if(user) {
      const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET!,{ expiresIn: '1h' });
      console.log("User logged In Succesfully",user,token);
      return res.status(200).json({ token, user });
    }else{
      console.log("Error in logIn user");
      return res.status(400).json({ message:'User not found, please register first.' });
    }
  } catch (error) {
    console.log("Error for login", error);
    return res.status(500).json({ message:'Internal Server Error', error });
  }
}

// Login
export const handleLoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if(user.isBlocked) {
      return res.status(403).json({message:"You are blocked by Admin, Cannot login to your account."})
    }

    // Check if the user has a password (non-Google users)
    if (!user.password) {
      return res.status(400).json({ message: 'This account is registered via Google. Please use Google Sign-In.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
