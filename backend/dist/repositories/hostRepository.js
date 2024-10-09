"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editHomestay = exports.findHomestaysByHost = exports.addHomestay = exports.createHost = exports.findHostByEmail = void 0;
const Host_1 = __importDefault(require("../entities/Host"));
const Homestay_1 = __importDefault(require("../entities/Homestay"));
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
//CREATE HOMESTAY
const addHomestay = async (homestayDetails) => {
    try {
        const homestay = new Homestay_1.default(homestayDetails);
        await homestay.save();
        console.log("Homestay Details:::", homestay);
        return homestay;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error('Error adding homestay: ' + error.message);
        }
        else {
            throw new Error('An unknown error occurred while adding homestay');
        }
    }
};
exports.addHomestay = addHomestay;
const findHomestaysByHost = async (hostId) => {
    return await Homestay_1.default.find({ host: hostId });
};
exports.findHomestaysByHost = findHomestaysByHost;
//EDIT HOMESTAY
const editHomestay = async (homestayId, updateDetails) => {
    const homestay = await Homestay_1.default.findById(homestayId);
    if (!homestay)
        throw new Error('Homestay not found');
    Object.assign(homestay, updateDetails);
    await homestay.save();
    return homestay;
};
exports.editHomestay = editHomestay;
