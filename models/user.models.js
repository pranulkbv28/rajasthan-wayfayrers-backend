import { Schema, model } from "mongoose";
import bycryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please add a full name"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    phoneNumber: {
      type: String,
      // required: [true, "Please add a phone number"],
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      // required: [true, "Please add a password"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    googleUID: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bycryptjs.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bycryptjs.compare(password, this.password);
};

userSchema.methods.generateAcessToken = function () {
  const payload = {
    _id: this._id,
    fullName: this.fullName,
    email: this.email,
    phoneNumber: this.phoneNumber,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10d",
  });
};

const User = model("User", userSchema);

export default User;
