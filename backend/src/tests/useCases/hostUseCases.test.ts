import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginHostUseCase, registerHostUseCase } from '../../useCases/hostUseCases/hostUseCases';
import * as hostRepository from '../../repositories/hostRepository/hostRepository';
import { IHost } from '../../entities/Host';
import {  verifyOtpAndRegisterHostUseCase } from '../../useCases/hostUseCases/hostUseCases';
import { otpService } from '../../services/otpService';

// Mocking dependencies
jest.mock('../../repositories/hostRepository');
jest.mock('../../services/otpService');
jest.mock('bcryptjs');

describe('Host Use Cases', () => {
  describe('loginHost', () => {
    it('should return token if login is successful', async () => {
      const mockHost: Partial<IHost> = {
        _id: 'mockId',
        email: 'host@example.com',
        password: await bcrypt.hash('hostpass', 10),
        role: 'host',
      };

      jest.spyOn(hostRepository, 'findHostByEmail').mockResolvedValue(mockHost as IHost);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('mockHostToken' as never);

      const token = await loginHostUseCase('host@example.com', 'hostpass');

      expect(token).toBe('mockHostToken');
    });

    it('should return null if login fails', async () => {
      jest.spyOn(hostRepository, 'findHostByEmail').mockResolvedValue(null);

      const token = await loginHostUseCase('wronghost@example.com', 'wrongpassword');

      expect(token).toBeNull();
    });
  });

  describe('registerHost', () => {
    it('should create and return the host', async () => {
      const mockHost: Partial<IHost> = {
        _id: 'mockId',
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hashedPassword',
        role: 'host',
      };
  
      jest.spyOn(hostRepository, 'createHost').mockResolvedValue(mockHost as IHost);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
  
      // Call registerHostUseCase with a single object
      const host = await registerHostUseCase({
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
      (hostRepository.findHostByEmail as jest.Mock).mockResolvedValue(null);
      (otpService.sendOtp as jest.Mock).mockResolvedValue('123456');

      const result = await registerHostUseCase({
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hostpass',
      });

      expect(result).toEqual({
        email: 'host@example.com',
        otp: '123456',
      });

      expect(otpService.sendOtp).toHaveBeenCalledWith('host@example.com');
      expect(hostRepository.findHostByEmail).toHaveBeenCalledWith('host@example.com');
    });

    it('should throw an error if host is already registered', async () => {
      (hostRepository.findHostByEmail as jest.Mock).mockResolvedValue({
        email: 'host@example.com',
      });

      await expect(
        registerHostUseCase({
          name: 'Host Name',
          email: 'host@example.com',
          password: 'hostpass',
        })
      ).rejects.toThrow('Host already registered');

      expect(hostRepository.findHostByEmail).toHaveBeenCalledWith('host@example.com');
    });
  });
});


  describe('verifyOtpAndRegisterHostUseCase', () => {
    it('should create a host if OTP is correct', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  
      const mockHost = {
        _id: 'mockId',
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hashedPassword',
      };
      (hostRepository.createHost as jest.Mock).mockResolvedValue(mockHost);
  
      // Call with the correct number of arguments
      const result = await verifyOtpAndRegisterHostUseCase(
        'host@example.com',    // email
        '123456',              // otp
        'hostpass',            // name
        'hostpass'             // password
      );
  
      expect(result).toEqual(mockHost);
      expect(bcrypt.hash).toHaveBeenCalledWith('hostpass', 10);
      expect(hostRepository.createHost).toHaveBeenCalledWith({
        name: 'Host Name',
        email: 'host@example.com',
        password: 'hashedPassword',
      });
    });
  
    it('should throw an error if OTP is invalid', async () => {
      await expect(
        verifyOtpAndRegisterHostUseCase(
          'host@example.com',   // email
          'wrongOtp',           // otp
          'hostpass',           // name
          'hostpass'            // password
        )
      ).rejects.toThrow('Invalid OTP');
    });
  });  

