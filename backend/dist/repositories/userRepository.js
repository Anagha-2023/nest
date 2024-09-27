"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.createUser = exports.findUserByEmail = void 0;
const User_1 = __importDefault(require("../entities/User"));
const findUserByEmail = async (email) => {
    try {
        console.log('Finding user with email:', email);
        return await User_1.default.findOne({ email });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error finding user by email:', error.message);
            throw new Error('Error finding user by email: ' + error.message);
        }
        else {
            throw new Error('Unknown error occurred while finding user by email');
        }
    }
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (user) => {
    try {
        return await User_1.default.create(user);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Error creating user: ' + error.message);
        }
        else {
            throw new Error('Unknown error occurred while creating user');
        }
    }
};
exports.createUser = createUser;
const updatePassword = async (email, hashedPassword) => {
    return User_1.default.updateOne({ email }, { $set: { password: hashedPassword } });
};
exports.updatePassword = updatePassword;
