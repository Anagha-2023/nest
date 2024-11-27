import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/serverconfig';
import { findHostByEmail, createHost, editHomestay } from '../../repositories/hostRepository/hostRepository';
import { otpService } from '../../services/otpService';
import Otp from '../../entities/Otp';
import Host from '../../entities/Host';
import { addHomestay } from '../../repositories/hostRepository/hostRepository';
import { IHomestay } from '../../entities/Homestay';
import { findHomestaysByHost } from '../../repositories/hostRepository/hostRepository';

// Use case to register host with OTP validation
export const loginHostUseCase = async (email: string, password: string): Promise<string | null> => {
  const host = await findHostByEmail(email);
  if (!host || !host.password || !(await bcrypt.compare(password, host.password))) {
    return null;
  }

  const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Use case to register host with OTP validation
export const registerHostUseCase = async (hostData: { email: string; password: string; name: string }) => {
  const { email, password, name } = hostData;

  const existingHost = await findHostByEmail(email);
  if (existingHost) {
    throw new Error('Host already registered');
  }

  const otp = await otpService.sendOtp(email);
  return { email, otp };
};

// Verifying OTP and completing host registration
export const verifyOtpAndRegisterHostUseCase = async (email: string, otp: string, name: string, password: string) => {
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const host = new Host({ name, email, password: hashedPassword, verified: true });
  await host.save();

  await Otp.deleteOne({ _id: otpRecord._id });
  return host;
};

// Resend OTP to the host
export const resendOtpUseCase = async (email: string) => {
  await Otp.deleteMany({ email });
  const otpCode = await otpService.sendOtp(email);
  return otpCode;
};

// Google sign-in use case
export const googleSignInUseCase = async (email: string, name: string, googleId: string) => {
  let host = await Host.findOne({ email });
  if (host) {
    const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
    return { token, host };
  }

  host = new Host({ name, email, googleId, verified: true });
  await host.save();
  const token = jwt.sign({ id: host._id }, JWT_SECRET, { expiresIn: '1h' });
  return { token, host };
};

// Updated addHomestayUsecases to accept 3 parameters
export const addHomestayUsecases = async (
  homestayDetails: IHomestay, 
  mainImage: Express.Multer.File | null, 
  additionalImages: Express.Multer.File[]
): Promise<IHomestay> => {
  try {
    //Parse 'services' if it is a string
    if(typeof homestayDetails.services === 'string') {
      try {
        homestayDetails.services = JSON.parse(homestayDetails.services);
      } catch (error) {
        console.error("Error parsing services",error);
        throw new Error("Invlaid format for Services");
      }
    }
    homestayDetails.image = mainImage ? mainImage.path : '';
    homestayDetails.images = additionalImages.map(img => img.path);

    const newHomestay = await addHomestay(homestayDetails);
    console.log("Successfully Added Homestays:", newHomestay);
    return newHomestay;
  } catch (error: unknown) {
    console.error("Error in addHomestayUsecases:", error);
    if (error instanceof Error) {
      throw new Error('Error adding homestay in useCases: ' + error.message);
    } else {
      throw new Error('An unknown error occurred while adding homestay');
    }
  }
};


export const getHomestays = async (hostId: string) => {
  return await findHomestaysByHost(hostId);
}




  export const editHomestayUsecases = async (
    homestayId: string, updatedDetails: Partial<IHomestay>
  ):Promise<IHomestay | null> => {
    const updatedHomestay = await editHomestay(homestayId,updatedDetails);
    return updatedHomestay;
  }

