"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminAuth_1 = require("../../interfaceAdapters/controllers/adminControllers/adminAuth");
const adminUseCases = __importStar(require("../../useCases/adminUseCases"));
jest.mock('../../src/useCases/adminUseCases');
describe('Admin Controller', () => {
    it('should handle successful admin login', async () => {
        const req = {
            body: {
                email: 'admin@example.com',
                password: 'password123',
            },
        };
        const res = {
            json: jest.fn(),
        };
        // Mock the adminLogin function
        adminUseCases.adminLogin.mockResolvedValue({
            token: 'mockAdminToken',
            admin: { _id: '1', email: 'admin@example.com', role: 'admin' },
        });
        await (0, adminAuth_1.handleAdminLogin)(req, res);
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
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mock the adminLogin function to throw an error
        adminUseCases.adminLogin.mockRejectedValue(new Error('Invalid credentials'));
        await (0, adminAuth_1.handleAdminLogin)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
});
