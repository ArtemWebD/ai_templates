import { Router } from "express";
import userController from "../user/user.controller.js";
import { body } from "express-validator";

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

//Refresh access token
authorizationRouter.get("/auth/refresh", userController.refresh);