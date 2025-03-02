import { Router } from "express";
import userController from "../user/user.controller.js";
import { body } from "express-validator";
import authMiddleware from "../../middlewares/auth.middleware.js";
import superAuthMiddleware from "../../middlewares/superAuth.middleware.js";

export const authorizationRouter = new Router({ mergeParams: true });

authorizationRouter.post(
    "/auth/registration",
    body("email").isEmail(),
    body("name").isLength({ min: 1, max: 30 }),
    body("password").isLength({ min: 6, max: 30 }),
    userController.registration
);

authorizationRouter.post(
    "/auth/login",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 30 }),
    userController.login
);

authorizationRouter.get("/auth/admin", authMiddleware, userController.checkAdmin);

//Refresh access token
authorizationRouter.get("/auth/refresh", userController.refresh);

authorizationRouter.get("/auth/users", authMiddleware, superAuthMiddleware, userController.getAll);