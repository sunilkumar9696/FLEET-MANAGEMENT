import express from "express";
import { createRoute ,getRoutes ,getRouteById ,updateRoute ,deleteRoute} from "../controllers/routeController.js";

const router = express.Router();

router.post("/", createRoute);     //create route
router.get("/", getRoutes);            // Get all
router.get("/:id", getRouteById);         // Get one
router.put("/:id", updateRoute);          // Update
router.delete("/:id", deleteRoute);       // Delete

export default router;
