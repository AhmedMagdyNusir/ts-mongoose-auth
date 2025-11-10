import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  req.cookies =
    req.headers.cookie?.split("; ").reduce<any>((acc, cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) acc[key] = decodeURIComponent(value);
      return acc;
    }, {}) || {};
  next();
};
