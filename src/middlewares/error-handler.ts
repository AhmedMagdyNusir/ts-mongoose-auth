import type { Request, Response, NextFunction } from "express";
import { isDevelopmentMode } from "@/utils/helpers";
import ApiError from "@/utils/classes/ApiError";

export default function globalErrorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    statusCode: err.statusCode || 500,
    message: err.message,
    ...(isDevelopmentMode ? { stack: err.stack } : {}),
  });
}
