import Location from "../models/Location.js";
import Vehicle from "../models/Vehicle.js";
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Add new location (with Google reverse geocode)
export const addLocation = async (req, res) => {
  try {
    const { vehicleId, driverId, latitude, longitude, speed, fuelLevel, eta } = req.body;

    // 🔥 Reverse geocoding for human-readable address
    let address = "";
    if (GOOGLE_API_KEY) {
      const geoRes = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      if (geoRes.data.results.length > 0) {
        address = geoRes.data.results[0].formatted_address;
      }
    }

    // Save location
    const location = new Location({ vehicleId, driverId, latitude, longitude, speed, address });
    await location.save();

    // Update vehicle info for dashboard
    await Vehicle.findByIdAndUpdate(vehicleId, {
      speed,
      fuelLevel,
      currentLocation: address || "Unknown",
      eta,
      status: speed > 0 ? "Moving" : "Idle"
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get latest location of a vehicle
export const getVehicleLatestLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ vehicleId: req.params.vehicleId })
      .sort({ timestamp: -1 });
    if (!location) return res.status(404).json({ message: "No location found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all active vehicle locations
export const getActiveLocations = async (req, res) => {
  try {
    const locations = await Location.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$vehicleId", latest: { $first: "$$ROOT" } } }
    ]);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
