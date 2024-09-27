import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, updatePassword } from "../repositories/userRepository";
import { sendResetEmail } from '../services/emailService'
import { JWT_SECRET } from '../config/serverconfig';
import User, {IUser} from '../entities/User';

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  try {
    const user = await findUserByEmail(email);
    
    // Check if the user exists and has a password (non-Google users)
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    }

    return null; // Invalid email/password or no password
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error logging in user: ' + error.message);
    } else {
      throw new Error('Unknown error occurred during login');
    }
  }
}


export const registerUser = async (name: string, phone: string, email: string, password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await createUser({ name, phone, email, password: hashedPassword, role: 'user' } as any);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error registering user: ' + error.message);
    } else {
      throw new Error('Unknown error occurred during registration');
    }
  }
}

export const ForgotPassword = async(email:string) => {
  const user = await findUserByEmail(email);
  if(!user) throw new Error('User not found, Please register first');

  if (user.isBlocked) throw new Error('User is blocked');

  const token = jwt.sign({email}, process.env.JWT_SECRET as string, {
    expiresIn:'1h',
  })
  const resetLink = `http://localhost:3000/reset-password?token=${token}`
  //Send Reset Password Link
  await sendResetEmail(email, resetLink);
  console.log('Reset password mail send successfully');
  
  return 'Reset password email sent Successfully.'
}

export const ResetPassword = async (email:string, newPassword:string, confirmPassword:string) => {
  if(newPassword !== confirmPassword) throw new Error ('Passwords do not match');

  const user = await findUserByEmail(email);

  if(!user) throw new Error ('User not found');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updatePassword(email, hashedPassword);
  return "password Updated Successfully";
}
