import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists before using it
const ensureUploadsDirectory = (uploadPath: string) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
  }
};

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../uploads') // Adjust for 'dist' directory in production
      : path.join(__dirname, '../../uploads'); // Adjust for development mode

    // Ensure the uploads folder exists
    ensureUploadsDirectory(uploadPath);

    cb(null, uploadPath); // Pass the dynamically calculated path to multer
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the original name and the timestamp
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize upload with limits and file type filtering
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/; // Accepted file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File type not supported!'));
    }
  }
});
