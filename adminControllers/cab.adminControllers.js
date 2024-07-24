import Cab from "../models/cab.models.js";
import CabDriver from "../models/cabDriver.models.js";
import ApiError from "../utils/ApiError.js";
import fieldValidation from "../utils/fieldValidation.js";

export const addCabDriver = async (req, res) => {
    try {
        const { fullName, phoneNumber, username } = req.body;
        const validInputs = fieldValidation({ fullName, phoneNumber, username });
        if (!validInputs) throw new ApiError(400, "Invalid Inputs");
        const existingDriver = await CabDriver.findOne(
            { $or: [{ username }, { phoneNumber }] }
        );
        if (existingDriver) throw new ApiError(400, "Driver already exists!");
        const newDriver = await CabDriver.create({
            fullName,
            phoneNumber,
            username
        });
        return res.status(200).json({
            message: "Driver added successfully",
            driver: newDriver
        });

    } catch (error) {
        console.log("ERROR IN ADDING CAB DRIVER: ", error.message);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

export const addCabDetails = async (req, res) => {
    try {
        const { cabName, cabNumber, cabVentilation, cabStatus, cabType, cabDriver } = req.body;
        const validInputs = fieldValidation({ cabName, cabNumber, cabVentilation, cabStatus, cabType, cabDriver });
        if (!validInputs) throw new ApiError(400, "Please Enter all Inputs");
        if (cabType !== "Sedan" && cabType !== "Hatchback" && cabType !== "SUV" && cabType !== "Luxury") throw new ApiError(400, "Invalid Cab Type!!");
        if (cabStatus !== "Available" && cabStatus !== "unavailable") throw new ApiError(400, "Please give the right Status!!");
        const existingCab = await Cab.findOne({ cabNumber });
        if (existingCab) throw new ApiError(400, "Cab already Exists!!");
        const existingCabDriver = await CabDriver.findOne({ username: cabDriver });
        if (!existingCabDriver) throw new ApiError(400, "Cab Driver Doesn't Exist!!");
        const newCab = await Cab.create({
            cabName,
            cabNumber,
            cabVentilation,
            cabStatus,
            cabType,
            cabDriver: existingCabDriver._id,
        });
        existingCabDriver.cabsDriven.push(newCab);
        await existingCabDriver.save();
        return res.status(200).json({
            message: "Cab Successfully Added to the fleet!!🚗",
            cabDetails: newCab,
        });
    } catch (error) {
        console.log("ERROR IN ADDING CAB DETAILS: ", error.message);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};