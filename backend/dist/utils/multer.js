"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure the uploads directory exists before using it
const ensureUploadsDirectory = (uploadPath) => {
    if (!fs_1.default.existsSync(uploadPath)) {
        fs_1.default.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    }
};
// Set storage engine
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = process.env.NODE_ENV === 'production'
            ? path_1.default.join(__dirname, '../uploads') // Adjust for 'dist' directory in production
            : path_1.default.join(__dirname, '../../uploads'); // Adjust for development mode
        // Ensure the uploads folder exists
        ensureUploadsDirectory(uploadPath);
        cb(null, uploadPath); // Pass the dynamically calculated path to multer
    },
    filename: (req, file, cb) => {
        // Create a unique filename using the original name and the timestamp
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    }
});
// Initialize upload with limits and file type filtering
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Error: File type not supported!'));
        }
    }
});
