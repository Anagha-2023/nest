import mongoose from 'mongoose';
import User, { IUser } from '../../entities/User';
import { findUserByEmail, createUser } from '../../repositories/userRepository';

describe('User Repository', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('findUserByEmail', () => {
    it('should return user if email exists', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const foundUser = await findUserByEmail('test@example.com');

      expect(foundUser).not.toBeNull();
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should return null if email does not exist', async () => {
      const foundUser = await findUserByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return the user', async () => {
      const user: IUser = new User({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      });

      const createdUser = await createUser(user);

      expect(createdUser).not.toBeNull();
      expect(createdUser.email).toBe('jane@example.com');
    });
  });
});
