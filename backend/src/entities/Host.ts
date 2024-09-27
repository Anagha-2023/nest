import mongoose, { Document, Schema } from 'mongoose';

// Define the IHost interface for a host document
export interface IHost extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleId?: string;
  role: 'host';
  status:'pending'| 'approved' | 'rejected' ;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
}

// Create the Host schema
const HostSchema = new Schema<IHost>({
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
  role: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: Boolean, required: true },
  isBlocked: {type: Boolean, default:false},
  
}, { timestamps: true });

const Host = mongoose.model<IHost>('Host', HostSchema);

export default Host;
