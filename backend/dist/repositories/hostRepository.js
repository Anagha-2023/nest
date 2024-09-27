"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHost = exports.findHostByEmail = void 0;
const Host_1 = __importDefault(require("../entities/Host"));
// Find a host by email
const findHostByEmail = async (email) => {
    return Host_1.default.findOne({ email });
};
exports.findHostByEmail = findHostByEmail;
// Create a new host
const createHost = async (hostData) => {
    const host = new Host_1.default({
        ...hostData,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return host.save();
};
exports.createHost = createHost;
