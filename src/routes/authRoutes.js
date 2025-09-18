import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

// Example of role-based protected route
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}` });
});

export default router;