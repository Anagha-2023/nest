import mongoose, { Document, Schema } from 'mongoose';

export interface IHomestay extends Document {
  host: Schema.Types.ObjectId;
  name: string;
  country: string;
  pricePerNight: number;
  image: string;
  images?: string[];
  removedImages?: string[];
  rooms: number;
  description: string;
  services: Array<{ name: string; available: boolean }>;
  cancellationPeriod: number;
  offerPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

const HomestaySchema = new Schema<IHomestay>(
  {
    host: { type: Schema.Types.ObjectId, ref: "Host", required: true }, // Reference to the Host model
    name: { type: String, required: true },
    country: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    image: { type: String, required: true },
    images: { type: [String], required: true },
    rooms: { type: Number, required: true },
    description: { type: String, required: true },
    services: [
      {
        name: { type: String, required: true },
        available: { type: Boolean, required: true },
      },
    ],
    cancellationPeriod: { type: Number, required: true },
    offerPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Homestay = mongoose.model<IHomestay>('Homestay', HomestaySchema);
export default Homestay;
