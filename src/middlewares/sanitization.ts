import { Request, Response, NextFunction, RequestHandler } from "express";

type Modifier = (value: string) => string;

/**
 * Middleware factory that applies a modifier function to specific fields in req.body.
 *
 * @param modifier - Function to apply to each field.
 * @param paths - Dot-separated field paths (e.g. "user.name", "email").
 * @returns An Express middleware.
 */

function modifyFields(modifier: Modifier, ...paths: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    paths.forEach((path) => {
      const keys = path.split(".");
      let obj: any = req.body;

      for (let i = 0; i < keys.length - 1; i++) {
        if (obj && typeof obj === "object") {
          obj = obj[keys[i]];
        } else {
          return;
        }
      }

      const lastKey = keys[keys.length - 1];
      if (typeof obj?.[lastKey] === "string") {
        obj[lastKey] = modifier(obj[lastKey]);
      }
    });

    next();
  };
}

export const trim = (...paths: string[]): RequestHandler => modifyFields((str) => str.trim(), ...paths);

export const toLowerCase = (...paths: string[]): RequestHandler => modifyFields((str) => str.toLowerCase(), ...paths);

export const toUpperCase = (...paths: string[]): RequestHandler => modifyFields((str) => str.toUpperCase(), ...paths);
