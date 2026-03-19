import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", (req, res, next) => {
  register(req, res).catch(next);
});

authRouter.post("/login", (req, res, next) => {
  login(req, res).catch(next);
});

