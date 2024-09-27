import { User } from '../entities/User'; // Import your User type or interface

declare global {
  namespace Express {
    interface Request {
      user?: User; // Define the custom property here
    }
  }
}
