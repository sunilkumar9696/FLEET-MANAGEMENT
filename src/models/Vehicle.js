import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // linked driver
  registrationNumber: { type: String, required: true, unique: true },
  insuranceValidity: { type: Date },
  fuelType: { type: String, enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] },
  lastServiceDate: { type: Date },
  vehicleType: { type: String, enum: ["Truck", "Van", "Car", "Bike", "Bus"] },
  status: { type: String, enum: ["Active", "Idle", "Maintenance", "Offduty" ,"Parked" , "Moving" , "Break" , "Reached"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
