import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "@/utils/classes/ApiError";
import asyncErrorHandler from "@/utils/helpers/async-error-handler";
import verifyToken from "@/utils/helpers/verify-token";
import UserModel from "@/models/users";
import { trim } from "@/middlewares/sanitization";
import { REFRESH_TOKEN_ERROR } from "@/utils/constants";

const { JWT_SECRET_KEY, JWT_AT_EXPIRATION_TIME, JWT_RT_EXPIRATION_TIME } = process.env;

if (!JWT_SECRET_KEY || !JWT_AT_EXPIRATION_TIME || !JWT_RT_EXPIRATION_TIME)
  throw new Error("Please define all the JWT environment variables inside .env");

const generateAccessToken = (_id: string) =>
  jwt.sign({ _id }, JWT_SECRET_KEY, { expiresIn: `${Number(JWT_AT_EXPIRATION_TIME)}s` });

const generateRefreshToken = (_id: string) =>
  jwt.sign({ _id }, JWT_SECRET_KEY, { expiresIn: `${Number(JWT_RT_EXPIRATION_TIME)}s` });

interface JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

const cookiesOptions = {
  httpOnly: true,
  maxAge: Number(JWT_RT_EXPIRATION_TIME) * 1000, // `maxAge` is the expiration time of the refresh token in the client in MILLISECONDS.
  sameSite: "none" as const, // type-safe
  secure: true,
};

export const trimUsername = trim("username");

export const handleDefaultFields = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.role) req.body.role = "محرر";
  next();
};

// =============================================================

export const register = asyncErrorHandler(async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ username, password: hashedPassword, role });
  const rt = generateRefreshToken(user._id.toString());
  res.cookie("rt", rt, cookiesOptions);
  const at = generateAccessToken(user._id.toString());
  res.status(201).json({ data: user, at });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError(401, "اسم المستخدم أو كلمة المرور غير صحيحة."));
  const rt = generateRefreshToken(user._id.toString());
  res.cookie("rt", rt, cookiesOptions);
  const at = generateAccessToken(user._id.toString());
  res.status(200).json({ data: user, at });
});

export const logout = asyncErrorHandler(async (req, res) => {
  res.clearCookie("rt");
  res.sendStatus(204);
});

export const refreshAccessToken = asyncErrorHandler(async (req, res, next) => {
  const refreshToken = req.cookies.rt;
  if (!refreshToken) return next(new ApiError(401, REFRESH_TOKEN_ERROR));
  const decoded = verifyToken(refreshToken, next, { general: REFRESH_TOKEN_ERROR }) as JwtPayload;
  if (!decoded) return; // If verifyToken calls next with an error, we exit here.
  const user = await UserModel.findById(decoded._id);
  if (!user) return next(new ApiError(404, "المستخدم غير موجود."));
  res.status(200).json({ data: user, at: generateAccessToken(user._id.toString()) });
});
