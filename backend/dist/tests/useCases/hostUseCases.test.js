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
const hostUseCases_1 = require("../../useCases/hostUseCases/hostUseCases");
const hostRepository = __importStar(require("../../repositories/hostRepository/hostRepository"));
const hostUseCases_2 = require("../../useCases/hostUseCases/hostUseCases");
const otpService_1 = require("../../services/otpService");
// Mocking dependencies
jest.mock('../../repositories/hostRepository');
jest.mock('../../services/otpService');
jest.mock('bcryptjs');
describe('Host Use Cases', () => {
    describe('loginHost', () => {
        it('should return token if login is successful', async () => {
            const mockHost = {
                _id: 'mockId',
                email: 'host@example.com',
                password: await bcryptjs_1.default.hash('hostpass', 10),
                role: 'host',
            };
            jest.spyOn(hostRepository, 'findHostByEmail').mockResolvedValue(mockHost);
            bcryptjs_1.default.compare.mockResolvedValue(true);
            jest.spyOn(jsonwebtoken_1.default, 'sign').mockReturnValue('mockHostToken');
            const token = await (0, hostUseCases_1.loginHostUseCase)('host@example.com', 'hostpass');
            expect(token).toBe('mockHostToken');
        });
        it('should return null if login fails', async () => {
            jest.spyOn(hostRepository, 'findHostByEmail').mockResolvedValue(null);
            const token = await (0, hostUseCases_1.loginHostUseCase)('wronghost@example.com', 'wrongpassword');
            expect(token).toBeNull();
        });
    });
    describe('registerHost', () => {
        it('should create and return the host', async () => {
            const mockHost = {
                _id: 'mockId',
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hashedPassword',
                role: 'host',
            };
            jest.spyOn(hostRepository, 'createHost').mockResolvedValue(mockHost);
            jest.spyOn(bcryptjs_1.default, 'hash').mockResolvedValue('hashedPassword');
            // Call registerHostUseCase with a single object
            const host = await (0, hostUseCases_1.registerHostUseCase)({
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hostpass',
            });
            expect(host).toEqual(mockHost);
        });
    });
});
describe('Register Host Use Cases', () => {
    describe('registerHostUseCase', () => {
        it('should generate an OTP and return email and OTP if host is not registered', async () => {
            hostRepository.findHostByEmail.mockResolvedValue(null);
            otpService_1.otpService.sendOtp.mockResolvedValue('123456');
            const result = await (0, hostUseCases_1.registerHostUseCase)({
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hostpass',
            });
            expect(result).toEqual({
                email: 'host@example.com',
                otp: '123456',
            });
            expect(otpService_1.otpService.sendOtp).toHaveBeenCalledWith('host@example.com');
            expect(hostRepository.findHostByEmail).toHaveBeenCalledWith('host@example.com');
        });
        it('should throw an error if host is already registered', async () => {
            hostRepository.findHostByEmail.mockResolvedValue({
                email: 'host@example.com',
            });
            await expect((0, hostUseCases_1.registerHostUseCase)({
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hostpass',
            })).rejects.toThrow('Host already registered');
            expect(hostRepository.findHostByEmail).toHaveBeenCalledWith('host@example.com');
        });
    });
});
describe('verifyOtpAndRegisterHostUseCase', () => {
    it('should create a host if OTP is correct', async () => {
        bcryptjs_1.default.hash.mockResolvedValue('hashedPassword');
        const mockHost = {
            _id: 'mockId',
            name: 'Host Name',
            email: 'host@example.com',
            password: 'hashedPassword',
        };
        hostRepository.createHost.mockResolvedValue(mockHost);
        // Call with the correct number of arguments
        const result = await (0, hostUseCases_2.verifyOtpAndRegisterHostUseCase)('host@example.com', // email
        '123456', // otp
        'hostpass', // name
        'hostpass' // password
        );
        expect(result).toEqual(mockHost);
        expect(bcryptjs_1.default.hash).toHaveBeenCalledWith('hostpass', 10);
        expect(hostRepository.createHost).toHaveBeenCalledWith({
            name: 'Host Name',
            email: 'host@example.com',
            password: 'hashedPassword',
        });
    });
    it('should throw an error if OTP is invalid', async () => {
        await expect((0, hostUseCases_2.verifyOtpAndRegisterHostUseCase)('host@example.com', // email
        'wrongOtp', // otp
        'hostpass', // name
        'hostpass' // password
        )).rejects.toThrow('Invalid OTP');
    });
});
