"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApprovalEmail = exports.sendResetEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
            pass: process.env.EMAIL_PASS || 'mqcv ehzl fofq voya'
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
    };
    try {
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending OTP mail:", error);
        throw new Error("Failed to send OTP email.");
    }
};
exports.sendOtpEmail = sendOtpEmail;
const sendResetEmail = async (email, resetLink) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
            pass: process.env.EMAIL_PASS || 'mqcv ehzl fofq voya',
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
        to: email,
        subject: 'Reset Password Request',
        text: `You have requested to reset your password. Click on the link below to reset it:
    
    ${resetLink}

    If you didn't request this, please ignore this email.`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
        console.log(resetLink);
    }
    catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email.');
    }
};
exports.sendResetEmail = sendResetEmail;
const sendApprovalEmail = async (email, name) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
            pass: process.env.EMAIL_PASS || 'mqcv ehzl fofq voya'
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
        to: email,
        subject: 'Host Account Approved!',
        text: `Dear ${name},

Congratulations! Your host account has been approved by our admin team.

You now have full access to all host features and can start listing your properties.

What you can do now:
- Log in to your account
- Complete your host profile
- Add your property listings
- Start accepting bookings

If you need any assistance, feel free to contact our support team.

Best regards,
The Admin Team`,
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; text-align: center;">Host Account Approved! 🎉</h2>
        
        <p style="color: #34495e;">Dear ${name},</p>
        
        <p style="color: #34495e;">Congratulations! Your host account has been approved by our admin team.</p>
        
        <p style="color: #34495e;">You now have full access to all host features and can start listing your properties.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">What you can do now:</h3>
          <ul style="color: #34495e;">
            <li>Log in to your account</li>
            <li>Complete your host profile</li>
            <li>Add your property listings</li>
            <li>Start accepting bookings</li>
          </ul>
        </div>
        
        <p style="color: #34495e;">If you need any assistance, feel free to contact our support team.</p>
        
        <p style="color: #34495e;">Best regards,<br>The Admin Team</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </div>`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent successfully to:', email);
    }
    catch (error) {
        console.error('Error sending approval email:', error);
        throw new Error('Failed to send approval email.');
    }
};
exports.sendApprovalEmail = sendApprovalEmail;
