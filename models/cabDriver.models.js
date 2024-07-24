import { Schema, model } from "mongoose";

const cabDriverSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please add a full name"],
            trim: true,
            index: true,
        },
        username: {
            type: String,
            required: [true, "Please add a username"],
            trim: true,
            index: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Please add a phone number"],
            unique: true,
        },
        cabsDriven: [
            {
                type: Schema.Types.ObjectId,
                ref: "Cab"
            }
        ]
    },
    { timestamps: true }
);

const CabDriver = model("CabDriver", cabDriverSchema);

export default CabDriver;