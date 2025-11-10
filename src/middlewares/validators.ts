import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncErrorHandler from "@/utils/helpers/async-error-handler";
import ApiError from "@/utils/classes/ApiError";

// =============================================================
// Types
// =============================================================

export type ValidatorFn = (value: unknown, req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export interface ValidatorOptions {
  allowNull?: boolean;
  allowEmptyString?: boolean;
}

// =============================================================
// validate()
// =============================================================

/**
 * Creates a middleware function to validate a specific field in a request object (e.g., `req.body.username`).
 *
 * @param field - The field to validate, specified as a string (e.g., `"body.username"`).
 * @param validators - An array of validator functions. Each function receives `(value, req, res, next)` and must call `next()` on success or `next(err)` on failure.
 *
 * @returns An Express middleware function that applies the specified validators to the given field.
 */

export const validate = (field: string, validators: ValidatorFn[]): RequestHandler => {
  return asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const value = field.split(".").reduce((obj: any, key) => obj?.[key], req);
    for (const validator of validators) {
      await new Promise<void>((resolve, reject) => {
        validator(value, req, res, (err?: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    next();
  });
};

// =============================================================
// validatorAsyncErrorHandler()
// =============================================================

export const validatorAsyncErrorHandler = (func: ValidatorFn): ValidatorFn => {
  return async (value, req, res, next) => {
    try {
      await func(value, req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// =============================================================
// Common Validators - `400` Bad Request Error
// =============================================================

export const isRequired = (message: string, options: ValidatorOptions = {}): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next(new ApiError(400, message));
    if (value === null && !options.allowNull) return next(new ApiError(400, message));
    if (value === "" && !options.allowEmptyString) return next(new ApiError(400, message));
    next();
  });

export const isRequiredIf = (
  condition: (req: Request) => boolean,
  message: string,
  options: ValidatorOptions = {},
): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (condition(req)) {
      if (value === undefined) return next(new ApiError(400, message));
      if (value === null && !options.allowNull) return next(new ApiError(400, message));
      if (value === "" && !options.allowEmptyString) return next(new ApiError(400, message));
    }
    next();
  });

export const isString = (message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();
    if (typeof value !== "string") return next(new ApiError(400, message));
    next();
  });

export const isBoolean = (message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();
    if (typeof value !== "boolean") return next(new ApiError(400, message));
    next();
  });

export const isDate = (message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();

    // Check if it's already a valid Date object
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return next(new ApiError(400, message));
      return next();
    }

    // Check if it's a valid date string that can be converted to Date
    if (typeof value === "string") {
      const date = new Date(value);
      if (isNaN(date.getTime())) return next(new ApiError(400, message));
      return next();
    }

    // If it's neither a Date object nor a string, it's invalid
    return next(new ApiError(400, message));
  });

export const isMongoId = (message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();
    if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value)) {
      return next(new ApiError(400, message));
    }
    next();
  });

export const isIn = (list: any[], message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();
    if (!list.includes(value)) return next(new ApiError(400, message));
    next();
  });

export const isArray = (message: string): ValidatorFn =>
  validatorAsyncErrorHandler((value, req, res, next) => {
    if (value === undefined) return next();
    if (!Array.isArray(value)) return next(new ApiError(400, message));
    next();
  });
