import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import connectDB from './src/config/database.js';
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }));

//Api routes
app.use("/api/auth", authRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;