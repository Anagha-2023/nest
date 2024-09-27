import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entities/User';
import Admin from '../entities/Admin';
import Host from '../entities/Host';

interface DecodedToken {
  user: { _id: string }; // Define the shape of the user object
  role: string;
}

const authMiddleware = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, Please login' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      if (!decoded || decoded.role !== role) {
        return res.status(403).json({ message: "Access forbidden: Incorrect role" });
      }

      let user;
      if (role === 'user') {
        user = await User.findById(decoded.user._id).select('isBlocked');
      } else if (role === 'host') {
        user = await Host.findById(decoded.user._id).select('isBlocked');
      } else if (role === 'admin') {
        user = await Admin.findById(decoded.user._id); // No need to check isBlocked for Admin
      }

      // Check if user or host is blocked
      if ((role === 'user' || role === 'host') && user && (user as { isBlocked: boolean }).isBlocked) {
        return res.status(403).json({ message: 'Access forbidden: User blocked' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }
  };
};

export default authMiddleware;
