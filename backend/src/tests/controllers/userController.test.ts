import { Request, Response } from 'express';
import { handleLoginUser, registerUser } from '../../interfaceAdapters/controllers/userControllers/userAuth';
import * as userUseCases from '../../useCases/userUseCases';

describe('User Controller', () => {
  describe('handleloginUser', () => {
    it('should return token if login is successful', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      jest.spyOn(userUseCases, 'loginUser').mockResolvedValue('mockToken');

      await handleLoginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return 401 if credentials are invalid', async () => {
      const req = {
        body: {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      jest.spyOn(userUseCases, 'loginUser').mockResolvedValue(null);

      await handleLoginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('handleregisterUser', () => {
    it('should return user object if registration is successful', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      const mockUser = { name: 'John Doe', email: 'test@example.com', password: 'hashedPassword' };
      jest.spyOn(userUseCases, 'registerUser').mockResolvedValue(mockUser as any);

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });
});
