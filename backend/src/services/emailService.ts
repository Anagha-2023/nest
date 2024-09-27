import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
      pass: process.env.EMAIL_PASS ||'mqcv ehzl fofq voya'
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || 'anaghaammus555@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text:`Your OTP code is ${otp}. It will expire in 3 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP mail:", error);
    throw new Error("Failed to send OTP email.")  
  }
}

export const sendResetEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
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
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Failed to send reset password email.');
  }
};
