// src/tests/controllers/adminController.test.ts
import { Request, Response } from 'express';
import { handleAdminLogin } from '../../interfaceAdapters/controllers/adminControllers/adminAuth';
import * as adminUseCases from '../../useCases/adminUseCases';

jest.mock('../../src/useCases/adminUseCases');

describe('Admin Controller', () => {
  it('should handle successful admin login', async () => {
    const req = {
      body: {
        email: 'admin@example.com',
        password: 'password123',
      },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Mock the adminLogin function
    (adminUseCases.adminLogin as jest.Mock).mockResolvedValue({
      token: 'mockAdminToken',
      admin: { _id: '1', email: 'admin@example.com', role: 'admin' },
    });

    await handleAdminLogin(req, res);

    expect(res.json).toHaveBeenCalledWith({
      token: 'mockAdminToken',
      admin: { _id: '1', email: 'admin@example.com', role: 'admin' },
    });
  });

  it('should handle errors during admin login', async () => {
    const req = {
      body: {
        email: 'admin@example.com',
        password: 'wrongpassword',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the adminLogin function to throw an error
    (adminUseCases.adminLogin as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    await handleAdminLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
});
