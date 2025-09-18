import express from "express";
import { addLocation, getLocations, getDriverLatestLocation } from "../controllers/locationController.js";

const router = express.Router();

router.post("/", addLocation);
router.get("/", getLocations);
router.get("/driver/:driverId", getDriverLatestLocation);

export default router;
