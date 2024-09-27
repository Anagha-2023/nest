// hostTypes.ts
export interface HostData {
  hostId?: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  properties?: any[];  // Adjust based on your project needs
}


export interface GoogleHostData {
  email: string;
  name: string;
  googleId: string;
  id: string; // Ensure this is always a string and not string | undefined
}
