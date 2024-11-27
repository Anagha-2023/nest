import Host, { IHost } from '../../entities/Host';
import Homestay, { IHomestay } from '../../entities/Homestay';

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

//CREATE HOMESTAY
export const addHomestay = async (homestayDetails: IHomestay): Promise<IHomestay> => {
  try {
    const homestay = new Homestay(homestayDetails);
    await homestay.save();
    console.log("Homestay Details:::", homestay);
    return homestay;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error adding homestay: ' + error.message);
    } else {
      throw new Error('An unknown error occurred while adding homestay');
    }
  }
}

export const findHomestaysByHost = async (hostId: string) => {
  return await Homestay.find({host: hostId})
}

//EDIT HOMESTAY
export const editHomestay = async ( homestayId:string, updateDetails: Partial<IHomestay> ): Promise<IHomestay | null> => {
  const homestay = await Homestay.findById(homestayId);
  if(!homestay) throw new Error('Homestay not found')

    Object.assign(homestay, updateDetails);
    await homestay.save();
    return homestay;  
}