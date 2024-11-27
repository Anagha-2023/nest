import mongoose from 'mongoose';
import Host from '../../entities/Host';
import { findHostByEmail, createHost } from '../../repositories/hostRepository/hostRepository';

// Define a simpler interface for test data (without Mongoose-specific fields)
interface IHostData {
  name: string;
  email: string;
  password: string;
  role: 'host';
  verified: boolean;
}

describe('Host Repository', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Host.deleteMany({});
  });

  describe('findHostByEmail', () => {
    it('should return host if email exists', async () => {
      const hostData: IHostData = {
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hostpass',
        role: 'host',
        verified: true,
      };

      const host = new Host(hostData);
      await host.save();

      const foundHost = await findHostByEmail('host@example.com');

      expect(foundHost).not.toBeNull();
      expect(foundHost?.email).toBe('host@example.com');
    });

    it('should return null if email does not exist', async () => {
      const foundHost = await findHostByEmail('nonexistenthost@example.com');

      expect(foundHost).toBeNull();
    });
  });

  describe('createHost', () => {
    it('should create and return the host', async () => {
      const hostData: IHostData = {
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hostpass',
        role: 'host',
        verified: true,
      };

      const createdHost = await createHost(hostData as any);

      expect(createdHost).not.toBeNull();
      expect(createdHost.email).toBe('host@example.com');
    });
  });
});
