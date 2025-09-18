import express from "express";
import { addLocation, getVehicleLatestLocation, getActiveLocations } from "../controllers/locationController.js";

const router = express.Router();

router.post("/", addLocation);  // update live location
router.get("/active", getActiveLocations); // all latest vehicle locations
router.get("/vehicle/:vehicleId", getVehicleLatestLocation); // latest location by vehicle

export default router;
