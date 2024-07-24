import express from "express";
import { addCabDetails, addCabDriver } from "../../adminControllers/cab.adminControllers.js";

const router = express.Router();

router.route("/add-cab-driver").post(addCabDriver);
router.route("/add-cab-details").post(addCabDetails);

export default router;