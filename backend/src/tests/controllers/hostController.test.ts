import { Request, Response } from 'express';
import { registerHostController, hostLoginController } from '../../interfaceAdapters/controllers/hostControllers/hostAuth';
import * as hostUseCases from '../../useCases/hostUseCases/hostUseCases';

describe('Host Controller', () => {
  describe('hostLoginController', () => {
    it('should return token if login is successful', async () => {
      const req = {
        body: {
          email: 'host@example.com',
          password: 'hostpass'
        }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      jest.spyOn(hostUseCases, 'loginHostUseCase').mockResolvedValue('mockHostToken');

      await hostLoginController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mockHostToken' });
    });

    it('should return 401 if credentials are invalid', async () => {
      const req = {
        body: {
          email: 'wronghost@example.com',
          password: 'wrongpassword'
        }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      jest.spyOn(hostUseCases, 'loginHostUseCase').mockResolvedValue(null);

      await hostLoginController(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });


  describe('handleregisterHost', () => {
    it('should return host object if registration is successful', async () => {
      const req = {
        body: {
          name: 'Host Name',
          email: 'host@example.com',
          password: 'hostpass'
        }
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any as Response;

      const mockHost = { name: 'Host Name', email: 'host@example.com', password: 'hashedPassword' };
      jest.spyOn(hostUseCases, 'registerHostUseCase').mockResolvedValue(mockHost as any);

      await registerHostController(req, res);

      jest.spyOn(hostUseCases, 'registerHostUseCase').mockResolvedValue(mockHost as any);

      await registerHostController(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockHost);
    });
  });
});

