"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Admin_1 = __importDefault(require("../../entities/Admin"));
const adminRepository_1 = require("../../repositories/adminRepository");
describe('Admin Repository', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect('mongodb://localhost:27017/testdb');
    });
    afterAll(async () => {
        await mongoose_1.default.connection.dropDatabase();
        await mongoose_1.default.connection.close();
    });
    afterEach(async () => {
        await Admin_1.default.deleteMany({});
    });
    describe('findAdminByEmail', () => {
        it('should return admin if email exists', async () => {
            const admin = new Admin_1.default({
                name: 'Admin Name',
                email: 'admin@example.com',
                password: 'adminpass'
            });
            await admin.save();
            const foundAdmin = await (0, adminRepository_1.findAdminByEmail)('admin@example.com');
            expect(foundAdmin).not.toBeNull();
            expect(foundAdmin?.email).toBe('admin@example.com');
        });
        it('should return null if email does not exist', async () => {
            const foundAdmin = await (0, adminRepository_1.findAdminByEmail)('nonexistentadmin@example.com');
            expect(foundAdmin).toBeNull();
        });
    });
});
