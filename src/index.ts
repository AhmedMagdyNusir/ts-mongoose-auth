import express from "express";
import config from "@/config";
import routes from "@/routes";
import connectToDatabase from "@/database/connection";
import cookiesParser from "@/middlewares/cookiesParser";
import logger from "@/middlewares/logger";
import globalErrorHandler from "@/middlewares/error-handler";

// Connect to the database
connectToDatabase();

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookiesParser);

// Middleware to log requests
app.use(logger);

// Mount the routes
app.use(routes);

// Middleware to handle errors globaly
app.use(globalErrorHandler);

const PORT = config.require("PORT");
const ENVIRONMENT = config.require("ENVIRONMENT");

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${ENVIRONMENT} mode.`));
