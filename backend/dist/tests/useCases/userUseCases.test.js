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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userUseCases_1 = require("../../useCases/userUseCases");
const userRepository = __importStar(require("../../repositories/userRepository"));
jest.mock('../../repositories/userRepository');
describe('User Use Cases', () => {
    describe('loginUser', () => {
        it('should return token if login is successful', async () => {
            const mockUser = {
                _id: 'mockId',
                email: 'test@example.com',
                password: await bcryptjs_1.default.hash('password123', 10),
                role: 'user'
            };
            jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);
            jest.spyOn(bcryptjs_1.default, 'compare').mockResolvedValue(true);
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockReturnValue('mockToken');
            const token = await (0, userUseCases_1.loginUser)('test@example.com', 'password123');
            expect(token).toBe('mockToken');
        });
        it('should return null if login fails', async () => {
            jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
            const token = await (0, userUseCases_1.loginUser)('wrong@example.com', 'wrongpassword');
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
            jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);
            jest.spyOn(bcryptjs_1.default, 'hash').mockResolvedValue('hashedPassword');
            const user = await (0, userUseCases_1.registerUser)('Jane Doe', '9037351622', 'jane@example.com', 'password123');
            expect(user).toEqual(mockUser);
        });
    });
});
