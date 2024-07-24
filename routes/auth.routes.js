import express from "express";
import {
  googleAuth,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/auth.middleare.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/google-login").post();
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/signup").post(signupUser);
router.route("/google-signup").post(googleAuth);

export default router;
