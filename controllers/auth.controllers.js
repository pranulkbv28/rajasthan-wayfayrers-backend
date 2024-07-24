import fieldValidation from "../utils/fieldValidation.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import bycryptjs from "bcryptjs";
import { cookieOptions } from "../constants.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("ERROR IN GENERATING TOKEN: ", error.message);
    return res.status(500).json("Internal Server Error for generating tokens");
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email, phoneNumber, fullName, password } = req.body;
    const validInputs = fieldValidation({
      email,
      phoneNumber,
      fullName,
      password,
    });

    if (!validInputs) throw new ApiError(400, "Invalid Inputs");

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) throw new ApiError(400, "User already exists");

    const hashedPassword = await bycryptjs.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser._id
    );

    // console.log(accessToken, refreshToken);

    const user = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            loggedInUser: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          "User Signed In Successfully"
        )
      );
  } catch (error) {
    console.log("ERROR IN SIGNUP: ", error.message);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, displayName, uid, phoneNumber } = req.body;

    let user = await User.findOne({
      $or: [{ googleUID: uid }, { email }],
    });

    if (user) {
      user.fullName = displayName;
      user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
    } else {
      user = new User({
        fullName: displayName,
        email,
        googleUID: uid,
        phoneNumber: phoneNumber || undefined,
      });
    }

    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            loggedInUser: user,
            accessToken,
            refreshToken,
          },
          "User Signed In Successfully"
        )
      );
  } catch (error) {
    console.log("ERROR IN GOOGLE AUTH: ", error.message);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const loginUser = async (req, res) => {
  // get the information
  // validate the inputs if they are filled
  // check if user exists with your parameter(s)
  // compare password
  // if correct, proceed to generate token
  // else, error message

  try {
    const { email, phoneNumber, password } = req.body;

    const validatedInputs = fieldValidation({ email, phoneNumber, password });

    if (!validatedInputs)
      throw new ApiError(400, "Plaese Full all the details!!!");

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) throw new ApiError(404, "User doesn't exist!!");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Signed In Successfully"
        )
      );
  } catch (error) {
    console.log("ERROR IN LOGIN USER: ", error.message);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user_id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User Signed Out Successfully"));
  } catch (error) {
    console.log("ERROR IS LOGOUT USER: ", error.message);
    return res(500).json({
      message: "Internal server error",
    });
  }
};
