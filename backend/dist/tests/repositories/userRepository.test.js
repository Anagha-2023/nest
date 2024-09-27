"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../../entities/User"));
const userRepository_1 = require("../../repositories/userRepository");
describe('User Repository', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/testdb');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    afterEach(async () => {
        await User_1.default.deleteMany({});
    });
    describe('findUserByEmail', () => {
        it('should return user if email exists', async () => {
            const user = new User_1.default({
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            });
            await user.save();
            const foundUser = await (0, userRepository_1.findUserByEmail)('test@example.com');
            expect(foundUser).not.toBeNull();
            expect(foundUser?.email).toBe('test@example.com');
        });
        it('should return null if email does not exist', async () => {
            const foundUser = await (0, userRepository_1.findUserByEmail)('nonexistent@example.com');
            expect(foundUser).toBeNull();
        });
    });
    describe('createUser', () => {
        it('should create and return the user', async () => {
            const user = new User_1.default({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123'
            });
            const createdUser = await (0, userRepository_1.createUser)(user);
            expect(createdUser).not.toBeNull();
            expect(createdUser.email).toBe('jane@example.com');
        });
    });
});
