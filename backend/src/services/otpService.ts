import { generateOtp } from '../utils/otpGenerator';
import { sendOtpEmail } from './emailService';

export const otpService = {
  async sendOtp(email: string): Promise<string> {
    const otp = generateOtp();
    await sendOtpEmail(email, otp);  // Send OTP via email
    return otp;  // Return OTP to store for verification
  }
};
