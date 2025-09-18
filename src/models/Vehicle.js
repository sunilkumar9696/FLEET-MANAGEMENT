import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // linked driver
  registrationNumber: { type: String, required: true, unique: true },
  insuranceValidity: { type: Date },
  fuelType: { type: String, enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
  lastServiceDate: { type: Date },
  vehicleType: { type: String, enum: ["Truck", "Van", "Car", "Bike", "Bus"] },
  speed: { type: Number, default: 0 }, // km/h
  fuelLevel: { type: Number, default: 100 }, // percentage
  currentLocation: { type: String }, // e.g., "Highway A4, Km 45.2"
  eta: { type: String }, // e.g., "45 min"
  status: { type: String, enum: ["Active", "Idle", "Maintenance", "Offduty" ,"Parked" , "Moving" , "Break" , "Reached"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
