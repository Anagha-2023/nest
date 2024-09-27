// src/tests/useCases/adminUseCases.test.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminLogin } from '../../useCases/adminUseCases';
import { findAdminByEmail } from '../../repositories/adminRepository';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/repositories/adminRepository');

describe('Admin Use Cases', () => {
  it('should return a token and admin on successful login', async () => {
    const mockAdmin = { _id: '1', email: 'admin@example.com', password: 'hashedPassword', role: 'admin' };
    (findAdminByEmail as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    const result = await adminLogin('admin@example.com', 'password123');

    expect(result).toEqual({
      token: 'mockToken',
      admin: mockAdmin,
    });
  });

  it('should throw an error if admin is not found', async () => {
    (findAdminByEmail as jest.Mock).mockResolvedValue(null);

    await expect(adminLogin('nonexistent@example.com', 'password123')).rejects.toThrow('Admin not found');
  });

  it('should throw an error if passwords do not match', async () => {
    const mockAdmin = { _id: '1', email: 'admin@example.com', password: 'hashedPassword', role: 'admin' };
    (findAdminByEmail as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(adminLogin('admin@example.com', 'wrongPassword')).rejects.toThrow('Invalid credentials');
  });
});
