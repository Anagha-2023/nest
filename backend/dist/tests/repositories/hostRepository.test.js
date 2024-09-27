"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Host_1 = __importDefault(require("../../entities/Host"));
const hostRepository_1 = require("../../repositories/hostRepository");
describe('Host Repository', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/testdb');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    afterEach(async () => {
        await Host_1.default.deleteMany({});
    });
    describe('findHostByEmail', () => {
        it('should return host if email exists', async () => {
            const hostData = {
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hostpass',
                role: 'host',
                verified: true,
            };
            const host = new Host_1.default(hostData);
            await host.save();
            const foundHost = await (0, hostRepository_1.findHostByEmail)('host@example.com');
            expect(foundHost).not.toBeNull();
            expect(foundHost?.email).toBe('host@example.com');
        });
        it('should return null if email does not exist', async () => {
            const foundHost = await (0, hostRepository_1.findHostByEmail)('nonexistenthost@example.com');
            expect(foundHost).toBeNull();
        });
    });
    describe('createHost', () => {
        it('should create and return the host', async () => {
            const hostData = {
                name: 'Host Name',
                email: 'host@example.com',
                password: 'hostpass',
                role: 'host',
                verified: true,
            };
            const createdHost = await (0, hostRepository_1.createHost)(hostData);
            expect(createdHost).not.toBeNull();
            expect(createdHost.email).toBe('host@example.com');
        });
    });
});
