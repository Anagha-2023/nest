import { Request, Response } from 'express';
import User from '../../../entities/User';


//Fetch All users

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8; // Default to 8 users per page
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit); // Fetch users with pagination
    const totalUsers = await User.countDocuments(); // Total number of users

    res.status(200).json({
      message: 'Successfully fetched users',
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

//Block User

export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log("User Id:", userId);
    const user = await User.findById(userId)
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    user.isBlocked = true;
    await user.save();
    console.log("User Blocked Successfully");
    console.log("Blocked User:", user);
    return res.status(200).json({ message: 'User Blocked Successfully', user });
  } catch (error) {
    return res.status(500).json({ message: "Error blocking user." })
  }
}

//UnBlock User

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    user.save();
    console.log("User unblocked succesfully");
    return res.status(200).json({ message: 'User unblocked Successfully', user })
  } catch (error) {
    return res.status(500).json({ message: "Error to unblock user, Internal server error" })
  }
}