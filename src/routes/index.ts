import { Router } from "express";
import ApiError from "@/utils/classes/ApiError";
import auth from "./auth";

const router = Router();

// An endpoint to check if the server is running
router.get("/", (req, res) => {
  res.send("App is running.");
});

// Basic routes
router.use("/auth", auth);

// Handle 404 errors for all other routes
router.use("/*splat", (req, res, next) => next(new ApiError(404, `This route does not exist: ${req.originalUrl}`)));

export default router;
