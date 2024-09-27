import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail } from '../repositories/adminRepository';
import Admin, { IAdmin } from '../entities/Admin';

export const adminLogin = async (email: string, password: string) => {
  // Find the admin by email
  const admin = await findAdminByEmail(email);
  
  // Check if the admin exists
  if (!admin) {
    throw new Error('Admin not found');
  }

  // Check if the role is 'admin'
  if (admin.role !== 'admin') {
    throw new Error('Unauthorized: You are not an admin');
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Create the JWT payload
  const payload = {
    user: {
      id: admin._id,
      role: admin.role,
    },
  };

  // Generate the JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  return { token, admin };
};
