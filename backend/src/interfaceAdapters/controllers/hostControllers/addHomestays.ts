import {Request, Response} from 'express';
import { addHomestayUsecases, editHomestayUsecases, getHomestays } from '../../../useCases/hostUseCases/hostUseCases';
import { IHomestay } from '../../../entities/Homestay';
import { MulterRequest } from '../../../types/multerTypes'; // Ensure correct path


export const addHomestayController = async (req: Request, res: Response): Promise<void> => {
  try {
    const mulReq = req as MulterRequest;
    console.log("Recieved Data:",req.body)
    const homestayDetails: IHomestay = {...mulReq.body, host: req.user};
    console.log("Homestay Details====", homestayDetails);
    const mainImage = mulReq.files?.image ? mulReq.files.image[0] : null;
    const additionalImages = mulReq.files?.images || [];
    const newHomestay = await addHomestayUsecases(homestayDetails, mainImage, additionalImages);

    res.status(201).json({
      message: 'Homestay Added Successfully',
      homestay: newHomestay,
    });
  } catch (error: unknown) {
    // Enhanced error logging
    console.error("Error in addHomestayController:", error);

    if (error instanceof Error) {
      res.status(500).json({
        message: 'Error adding homestay',
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred while adding homestay',
      });
    }
  }
};



export const fetchHomestays = async (req:Request, res: Response) => {
  console.log('/////////////////');
  
  try {
    const hostId = req.user._id;
    console.log("hostId:",hostId);
    const homestays = await getHomestays(hostId);
    res.status(200).json({message:'true', data:homestays})
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch homestays" });
  }
}


export const editHomestayController = async (req: Request, res: Response): Promise<void> => {
  try {
    const homestayId = req.params.id;
    console.log("HomestayId:", homestayId);
    console.log("Request body:", req.body);

    // Access uploaded files if any
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Directly access updated details from the request body
    const updatedDetails: Partial<IHomestay> = req.body; // No need to parse anything

    // Check if removedImages exists and log them
    const removedImages = updatedDetails.removedImages as string[] | undefined;
    if (removedImages) {
      console.log("Removed Images:", removedImages);
    }

    // If images are included in the update, process them
    if (files && files.images) {
      updatedDetails.images = files.images.map((file: Express.Multer.File) => file.path);
    }

    // Call the use case to edit the homestay
    const updatedHomestay = await editHomestayUsecases(homestayId, updatedDetails);
    
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
  } catch (error: unknown) {
    console.log("Error in homestay:", error);
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Error editing homestay',
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred while editing homestay',
      });
    }
  }
};



