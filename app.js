import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import connectDB from './src/config/database.js';
import authRoutes from "./src/routes/authRoutes.js";
import routeRoutes from "./src/routes/routeRoutes.js";
import vehicleRoutes from "./src/routes/vehicleRoutes.js";
import driverRoutes from "./src/routes/driverRoutes.js";
import locationRoutes from "./src/routes/locationRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

//Api routes
app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/vehicle" ,vehicleRoutes);
app.use("/api/driver" , driverRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;