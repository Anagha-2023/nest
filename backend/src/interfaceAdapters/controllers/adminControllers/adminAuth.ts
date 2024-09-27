import { Request, Response } from 'express';
import { adminLogin } from '../../../useCases/adminUseCases';

//Admin login

export const handleAdminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, admin } = await adminLogin(email, password);
    res.json({ token, admin });
  } catch (err) {
    console.error("Login Error:", err);
    
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const handleLogout = (req:Request, res:Response) => {
  res.status(200).json({message:'Admin Logged out successfully'})
}