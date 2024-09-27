"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    const mongoUrl = process.env.MONGODB_URI;
    if (!mongoUrl) {
        console.error('MongoDB connection URL is not defined.');
        process.exit(1);
    }
    mongoose_1.default.connect(mongoUrl).then(() => {
        console.log('MongoDB Connected');
    })
        .catch((err) => {
        console.log("Database connection error", err);
    });
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
