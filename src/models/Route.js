import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [{ type: String }],
  distance: String,
  duration: String,
  feedback:{type:String},
  status: { type: String, enum: ["Active", "Paused", "Completed", "Planned"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);
