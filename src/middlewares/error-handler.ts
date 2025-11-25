import type { Request, Response, NextFunction } from "express";
import config from "@/config";
import ApiError from "@/utils/classes/ApiError";

export default function globalErrorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    statusCode: err.statusCode || 500,
    message: err.message,
    ...(config.isDevelopmentMode ? { stack: err.stack } : {}),
  });
}
