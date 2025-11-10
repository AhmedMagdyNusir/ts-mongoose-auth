import { Router } from "express";

import { registerValidators, loginValidators } from "@/validators/auth";

import { handleDefaultFields, trimUsername, register, login, logout, refreshAccessToken } from "@/controllers/auth";

const router = Router();

router.post("/register", trimUsername, handleDefaultFields, registerValidators, register);
router.post("/login", trimUsername, loginValidators, login);
router.post("/logout", logout);
router.post("/refresh-access-token", refreshAccessToken);

export default router;
