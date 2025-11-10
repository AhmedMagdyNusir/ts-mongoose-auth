import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an asynchronous Express route handler and forwards any errors to the next middleware (e.g. error handler).
 *
 * This allows you to write async route handlers without try/catch blocks.
 *
 * @param func The async route handler to wrap.
 *
 * @returns A standard Express middleware function.
 */

export default function asyncHandler(
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
