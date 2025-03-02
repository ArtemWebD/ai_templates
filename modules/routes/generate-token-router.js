import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import superAuthMiddleware from "../../middlewares/superAuth.middleware.js";
import generateTokenController from "../generateToken/generateToken.controller.js";

export const generateTokenRouter = new Router({ mergeParams: true });

generateTokenRouter.post("/generate-token/", authMiddleware, superAuthMiddleware, generateTokenController.create);
generateTokenRouter.put("/generate-token/", authMiddleware, superAuthMiddleware, generateTokenController.increaseCount);
generateTokenRouter.post("/generate-token/all", authMiddleware, superAuthMiddleware, generateTokenController.getAllByUser);
generateTokenRouter.get("/generate-token/", authMiddleware, generateTokenController.getAll);