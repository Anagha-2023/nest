import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
    const mongoUrl: string = process.env.MONGODB_URI!  

    if (!mongoUrl) {
        console.error('MongoDB connection URL is not defined.');
        process.exit(1);
      }
    mongoose.connect(mongoUrl).then(()=>{
        console.log('MongoDB Connected');
    })
    .catch((err)=>{
        console.log("Database connection error", err);  
    })
};

export default connectDB;