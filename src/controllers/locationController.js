import Location from "../models/Location.js";

// Add location
export const addLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate("driverId");
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver’s latest location
export const getDriverLatestLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ driverId: req.params.driverId })
      .sort({ timestamp: -1 });
    if (!location) return res.status(404).json({ message: "No location found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
