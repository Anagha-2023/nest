import User, { IUser } from '../entities/User';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    console.log('Finding user with email:', email);
    return await User.findOne({ email });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error finding user by email:', error.message);
      throw new Error('Error finding user by email: ' + error.message);
    } else {
      throw new Error('Unknown error occurred while finding user by email');
    }
  }
};

export const createUser = async (user: IUser): Promise<IUser> => {
  try {
    return await User.create(user);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    } else {
      throw new Error('Unknown error occurred while creating user');
    }
  }
};

export const updatePassword = async (email:string, hashedPassword: string) => {
  return User.updateOne({email}, {$set:{password: hashedPassword}});
}
