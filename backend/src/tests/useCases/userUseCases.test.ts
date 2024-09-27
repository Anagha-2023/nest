import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser } from '../../useCases/userUseCases';
import * as userRepository from '../../repositories/userRepository';

jest.mock('../../repositories/userRepository');

describe('User Use Cases', () => {
  describe('loginUser', () => {
    it('should return token if login is successful', async () => {
      const mockUser = {
        _id: 'mockId',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user'
      };

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwt, 'sign').mockReturnValue('mockToken' as never);

      const token = await loginUser('test@example.com', 'password123');

      expect(token).toBe('mockToken');
    });

    it('should return null if login fails', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);

      const token = await loginUser('wrong@example.com', 'wrongpassword');

      expect(token).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should create and return the user', async () => {
      const mockUser = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const user = await registerUser('Jane Doe', '9037351622','jane@example.com', 'password123');

      expect(user).toEqual(mockUser);
    });
  });
});
