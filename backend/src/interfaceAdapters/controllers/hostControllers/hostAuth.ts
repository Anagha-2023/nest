import { Request, Response } from 'express';
import Host from '../../../entities/Host';
import Otp from '../../../entities/Otp';
import { generateOtp } from '../../../utils/otpGenerator';
import { sendOtpEmail } from '../../../services/emailService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Host Controller
export const registerHostController = async (req: Request, res: Response) => {
    const { name, phone, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        const existingHost = await Host.findOne({ email });
        if (existingHost) {
            return res.status(400).json({ message: 'Host already exists.' });
        }

        const otpCode = generateOtp();
        console.log("Otp:", otpCode);

        const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP valid for 3 minutes
        const otpRecord = new Otp({ email, otp: otpCode, expiresAt });
        await otpRecord.save();

        await sendOtpEmail(email, otpCode);
        console.log("Otp has been sent to email");

        res.status(200).json({ message: 'OTP sent to email.', host: { name, email, phone, password } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Verify OTP and Register Host
export const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp, phone, name, password, role } = req.body; // Ensure 'role' is extracted

        // Find the OTP record associated with the email
        const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase(), otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Check if the host already exists in the system
        let host = await Host.findOne({ email });

        // If the host does not exist, register a new host
        if (!host) {
            const hashedPassword = await bcrypt.hash(password, 10);
            host = new Host({
                name,
                email,
                phone,
                password: hashedPassword,
                role: role || 'host',  // Provide default role if not provided
                verified: true
            });
            await host.save();

            return res.status(201).json({
                message: 'User Registered Successfully',
                host: { name: host.name, email: host.email, phone: host.phone, role: host.role },
                token: jwt.sign({ id: host._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
            });
        }

        // If the host exists but is already verified
        if (host.verified) {
            return res.status(400).json({ message: "Host already registered and verified" });
        }

        // If the host exists but is not verified, mark them as verified
        host.verified = true;
        await host.save();

        // Remove the OTP record after successful verification
        await Otp.deleteOne({ _id: otpRecord._id });

        // Generate a JWT token
        const token = jwt.sign({ id: host._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'OTP verification success, Registration completed',
            host: { name: host.name, email: host.email, phone: host.phone, role: host.role },
            token
        });
    } catch (error) {
        console.error("Error in OTP verification:", error);

        if (error instanceof Error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }

        return res.status(500).json({ message: 'Server error' });
    }
};





// Host Login Controller
export const hostLoginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const host = await Host.findOne({ email });
        if (!host) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if (host.isBlocked) {
            return res.status(403).json({ message: 'You are blocked by Admin, You cannot login' });
        }

        // Check if password is defined
        if (!password || !host.password) {
            return res.status(401).json({ message: 'Password is required.' });
        }


        const isMatch = await bcrypt.compare(password, host.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Include the role in the JWT payload
        const token = jwt.sign(
            {user: {_id:host._id, role:host.role}},
            process.env.JWT_SECRET!,{expiresIn:'1h'}
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
};


// Google Sign-in for Host
export const googleHostsignInController = async (req: Request, res: Response) => {
    const { email, name, googleId } = req.body;

    try {
        let host = await Host.findOne({ email });
        if (host) {
            console.log("Host already exists");
            return res.status(400).json({ message: 'Host already exists with this email.' });
        }

        host = new Host({
            name,
            email,
            googleId,
            verified: true,
            role: 'host',
            phone: "0000000000",
            password: "google_auth",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await host.save();
        console.log("Host registered successfully via Google", host);
        res.status(201).json({ message: 'Host registered successfully via Google', host });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Resend OTP
export const resendHostOtp = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email: email.trim().toLowerCase() });
        if (!otpRecord) {
            return res.status(400).json({ message: 'No OTP request found for this email.' });
        }

        await Otp.deleteMany({ email: email.trim().toLowerCase() });
        const otpCode = generateOtp();
        console.log("New OTP:", otpCode);

        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
        const newOtpRecord = new Otp({ email, otp: otpCode, expiresAt });
        console.log("New otp Record", newOtpRecord);
        await newOtpRecord.save();

        await sendOtpEmail(email, otpCode);
        res.status(200).json({ message: 'A new OTP has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Google Login for Host
export const googleHostLoginController = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const host = await Host.findOne({ email });
        if (!host) {
            return res.status(400).json({ message: 'Host not found, please register first.' });
        }
        if (host.isBlocked) {
            return res.status(403).json({ message: "You are blocked by Admin, cannot log in to your account." });
        }

        const token = jwt.sign({ id: host._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
