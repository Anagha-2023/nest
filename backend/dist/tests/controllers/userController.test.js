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
const userAuth_1 = require("../../interfaceAdapters/controllers/userControllers/userAuth");
const userUseCases = __importStar(require("../../useCases/userUseCases"));
describe('User Controller', () => {
    describe('handleloginUser', () => {
        it('should return token if login is successful', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            jest.spyOn(userUseCases, 'loginUser').mockResolvedValue('mockToken');
            await (0, userAuth_1.handleLoginUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
        });
        it('should return 401 if credentials are invalid', async () => {
            const req = {
                body: {
                    email: 'wrong@example.com',
                    password: 'wrongpassword',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            jest.spyOn(userUseCases, 'loginUser').mockResolvedValue(null);
            await (0, userAuth_1.handleLoginUser)(req, res);
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
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockUser = { name: 'John Doe', email: 'test@example.com', password: 'hashedPassword' };
            jest.spyOn(userUseCases, 'registerUser').mockResolvedValue(mockUser);
            await (0, userAuth_1.registerUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });
});
