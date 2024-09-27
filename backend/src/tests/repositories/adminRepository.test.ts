import mongoose from 'mongoose';
import Admin, { IAdmin } from '../../entities/Admin';
import { findAdminByEmail } from '../../repositories/adminRepository';

describe('Admin Repository', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Admin.deleteMany({});
  });

  describe('findAdminByEmail', () => {
    it('should return admin if email exists', async () => {
      const admin = new Admin({
        name: 'Admin Name',
        email: 'admin@example.com',
        password: 'adminpass'
      });
      await admin.save();

      const foundAdmin = await findAdminByEmail('admin@example.com');

      expect(foundAdmin).not.toBeNull();
      expect(foundAdmin?.email).toBe('admin@example.com');
    });

    it('should return null if email does not exist', async () => {
      const foundAdmin = await findAdminByEmail('nonexistentadmin@example.com');

      expect(foundAdmin).toBeNull();
    });
  });
});
