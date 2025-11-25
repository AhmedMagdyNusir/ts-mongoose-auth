import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";
import config from "@/config";
import ApiError from "../classes/ApiError";

/**
 * Verifies a JWT token and returns the decoded payload or forwards an error.
 *
 * @param token - The JWT token to verify.
 * @param next - The next middleware function to call in case of an error.
 * @param errorMessages - Custom error messages for different scenarios.
 *
 * @returns The decoded payload if verification is successful, otherwise calls `next` with an error.
 */

export default function verifyToken(
  token: string,
  next: NextFunction,
  errorMessages: {
    expired?: string;
    invalid?: string;
    general?: string;
  } = {},
): string | JwtPayload | void {
  try {
    const decoded = jwt.verify(token, config.require("JWT_SECRET_KEY"));
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, errorMessages.expired || errorMessages.general || "انتهت صلاحية الرمز."));
    } else if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, errorMessages.invalid || errorMessages.general || "رمز غير صالح."));
    } else {
      return next(new ApiError(401, errorMessages.general || error.message || "فشل في التحقق من الرمز."));
    }
  }
}
