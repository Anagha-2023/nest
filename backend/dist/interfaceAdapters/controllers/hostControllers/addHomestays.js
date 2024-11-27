"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editHomestayController = exports.fetchHomestays = exports.addHomestayController = void 0;
const hostUseCases_1 = require("../../../useCases/hostUseCases/hostUseCases");
const addHomestayController = async (req, res) => {
    try {
        const mulReq = req;
        console.log("Recieved Data:", req.body);
        const homestayDetails = { ...mulReq.body, host: req.user };
        console.log("Homestay Details====", homestayDetails);
        const mainImage = mulReq.files?.image ? mulReq.files.image[0] : null;
        const additionalImages = mulReq.files?.images || [];
        const newHomestay = await (0, hostUseCases_1.addHomestayUsecases)(homestayDetails, mainImage, additionalImages);
        res.status(201).json({
            message: 'Homestay Added Successfully',
            homestay: newHomestay,
        });
    }
    catch (error) {
        // Enhanced error logging
        console.error("Error in addHomestayController:", error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'Error adding homestay',
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: 'An unknown error occurred while adding homestay',
            });
        }
    }
};
exports.addHomestayController = addHomestayController;
const fetchHomestays = async (req, res) => {
    console.log('/////////////////');
    try {
        const hostId = req.user._id;
        console.log("hostId:", hostId);
        const homestays = await (0, hostUseCases_1.getHomestays)(hostId);
        res.status(200).json({ message: 'true', data: homestays });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch homestays" });
    }
};
exports.fetchHomestays = fetchHomestays;
const editHomestayController = async (req, res) => {
    try {
        const homestayId = req.params.id;
        console.log("HomestayId:", homestayId);
        console.log("Request body:", req.body);
        // Access uploaded files if any
        const files = req.files;
        // Directly access updated details from the request body
        const updatedDetails = req.body; // No need to parse anything
        // Check if removedImages exists and log them
        const removedImages = updatedDetails.removedImages;
        if (removedImages) {
            console.log("Removed Images:", removedImages);
        }
        // If images are included in the update, process them
        if (files && files.images) {
            updatedDetails.images = files.images.map((file) => file.path);
        }
        // Call the use case to edit the homestay
        const updatedHomestay = await (0, hostUseCases_1.editHomestayUsecases)(homestayId, updatedDetails);
        // Check if the homestay was found and updated
        if (!updatedHomestay) {
            res.status(404).json({ message: 'Homestay not found' });
            return;
        }
        console.log("Homestay Updated Successfully:", updatedHomestay);
        res.status(200).json({
            message: 'Homestay updated successfully',
            homestay: updatedHomestay,
        });
    }
    catch (error) {
        console.log("Error in homestay:", error);
        if (error instanceof Error) {
            res.status(500).json({
                message: 'Error editing homestay',
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: 'An unknown error occurred while editing homestay',
            });
        }
    }
};
exports.editHomestayController = editHomestayController;
