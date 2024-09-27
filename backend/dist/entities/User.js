"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: function () {
            return !this.googleId; // Phone is required only if googleId is not present
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is required only if googleId is not present
        }
    },
    role: { type: String, enum: ['user'], default: 'user' },
    googleId: { type: String, required: false }, // Not required for non-Google sign-ins
    isVerified: { type: Boolean, default: false }, // Default to false unless user is verified
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
