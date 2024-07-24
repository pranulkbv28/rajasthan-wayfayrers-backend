import { Schema, model } from "mongoose";

const cabTypeEnum = ["Sedan", "Hatchback", "SUV", "Luxury"];
const cabStatusEnum = ["Available", "Unavailable"];
const cabVentilationEnum = ["AC", "Non-AC"];
const cabSeatEnum = ["5", "6", "7"];

const cabSchema = new Schema(
    {
        cabName: {
            type: String,
            required: [true, "Please add a cab name"],
            index: true,
        },
        cabNumber: {
            type: String,
            required: [true, "Please add a cab number"],
            unique: true,
        },
        cabDriver: {
            type: Schema.Types.ObjectId,
            ref: "CabDriver",
        },
        cabType: {
            type: cabTypeEnum,
            default: "Sedan",
        },
        cabStatus: {
            type: cabStatusEnum,
            default: "Available",
        },
        cabVentilation: {
            type: cabVentilationEnum,
            default: "AC",
        },
        cabSeat: {
            type: cabSeatEnum,
            default: 5,
        },
        pricePerKm: {
            type: Number,
            required: [true, "Please add a price per km"],
        },
        basePrice: {
            type: Number,
            required: [true, "Please add a base price"],
        },
    },
    { timestamps: true }
);

const Cab = model("Cab", cabSchema);

export default Cab;