import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define interface for the decoded token
interface DecodedToken {
  user: { _id: string, role: string };
}

export const authMiddleware = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Extract the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      // Log decoded token
      console.log("Decoded token:", decoded);
      console.log("User role:", decoded.user.role);
      
      // Check if the user role matches the required role
      if (decoded.user.role !== requiredRole) {
        return res.status(403).json({ message: `Access forbidden: Role ${requiredRole} required` });
      }

      // Attach user information to the request
      req.user = decoded.user;
      console.log(req.user)
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Log error for verification failure
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
