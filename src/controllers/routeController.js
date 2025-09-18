import Route from "../models/Route.js";

// ✅ Create new route
export const createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("driver vehicle");
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get route by ID
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("driver vehicle");
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update route
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete route
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
