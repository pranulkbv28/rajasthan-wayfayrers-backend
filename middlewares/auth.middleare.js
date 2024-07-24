import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) throw new ApiError(401, "Unauthoprized request!!");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid User Token!!");

    req.user = user;

    next();
  } catch (error) {
    console.log("ERROR IN VALIDATING TOKEN: ", error.message);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export default verifyJWT;
