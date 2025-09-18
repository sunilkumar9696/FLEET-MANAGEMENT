import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  license: { type: String, required: true }, // CDL-A, CDL-B etc.
  experience: { type: String }, // e.g. "8 years"
  vehicleModel: { type: String }, // e.g. "Volvo FH16"
  totalTrips: { type: Number, default: 0 },
  successfulTrips: { type: Number, default: 0 },
  status: { type: String, enum: ["On Break", "On Ride", "Maintenance", "Offduty" , "Available" , "New Driver" ], default: "Available" }
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
