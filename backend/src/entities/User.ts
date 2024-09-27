import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string; // Optional when googleId is present
  password?: string; // Optional when googleId is present
  role: 'user';
  isVerified: boolean;
  googleId?: string; // Optional because it will be present only for Google sign-ins
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: function() {
      return !this.googleId; // Phone is required only if googleId is not present
    }
  },
  password: { 
    type: String, 
    required: function() {
      return !this.googleId; // Password is required only if googleId is not present
    }
  },
  role: { type: String, enum: ['user'], default: 'user' },
  googleId: { type: String, required: false }, // Not required for non-Google sign-ins
  isVerified: { type: Boolean, default: false }, // Default to false unless user is verified
  isBlocked: {type: Boolean, default:false},
}, { timestamps: true });

const User = model<IUser>('User', UserSchema);

export default User;
