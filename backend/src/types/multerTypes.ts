import { Request } from 'express';

export interface MulterRequest extends Request {
  files: {
    image?: Express.Multer.File[]; // Type for the main image
    images?: Express.Multer.File[]; // Type for additional images
  };
}
