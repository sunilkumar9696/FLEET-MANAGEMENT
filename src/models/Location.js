import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  speed: { type: Number }, // km/h
  address: { type: String }, // reverse geocode with Google API
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Location", locationSchema);
