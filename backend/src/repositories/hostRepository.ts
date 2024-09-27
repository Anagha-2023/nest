import Host, { IHost } from '../entities/Host';

// Type for creating a host (excluding unnecessary fields)
type CreateHostInput = Omit<IHost, '_id' | 'createdAt' | 'updatedAt' | '$$populatedPaths'>;

// Find a host by email
export const findHostByEmail = async (email: string): Promise<IHost | null> => {
  return Host.findOne({ email });
};

// Create a new host
export const createHost = async (hostData: CreateHostInput): Promise<IHost> => {
  const host = new Host({
    ...hostData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return host.save();
};
