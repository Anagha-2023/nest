"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/tests/useCases/adminUseCases.test.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminUseCases_1 = require("../../useCases/adminUseCases");
const adminRepository_1 = require("../../repositories/adminRepository");
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/repositories/adminRepository');
describe('Admin Use Cases', () => {
    it('should return a token and admin on successful login', async () => {
        const mockAdmin = { _id: '1', email: 'admin@example.com', password: 'hashedPassword', role: 'admin' };
        adminRepository_1.findAdminByEmail.mockResolvedValue(mockAdmin);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue('mockToken');
        const result = await (0, adminUseCases_1.adminLogin)('admin@example.com', 'password123');
        expect(result).toEqual({
            token: 'mockToken',
            admin: mockAdmin,
        });
    });
    it('should throw an error if admin is not found', async () => {
        adminRepository_1.findAdminByEmail.mockResolvedValue(null);
        await expect((0, adminUseCases_1.adminLogin)('nonexistent@example.com', 'password123')).rejects.toThrow('Admin not found');
    });
    it('should throw an error if passwords do not match', async () => {
        const mockAdmin = { _id: '1', email: 'admin@example.com', password: 'hashedPassword', role: 'admin' };
        adminRepository_1.findAdminByEmail.mockResolvedValue(mockAdmin);
        bcryptjs_1.default.compare.mockResolvedValue(false);
        await expect((0, adminUseCases_1.adminLogin)('admin@example.com', 'wrongPassword')).rejects.toThrow('Invalid credentials');
    });
});
