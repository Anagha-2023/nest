import Admin, { IAdmin } from '../entities/Admin';

export const findAdminByEmail = async (email: string): Promise<IAdmin | null> => {
  try {
    console.log(`Searching for admin with email: ${email}`);
    const admin = await Admin.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
    console.log(`Found admin: ${admin}`);
    return admin;
  } catch (error) {
    console.error('Error executing findAdminByEmail:', error);
    throw error;
  }
};
