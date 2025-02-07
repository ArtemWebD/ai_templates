import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import generatedWhitePageController from "../generatedWhitePage/generatedWhitePage.controller.js";

export const generatedWhitePageRouter = new Router();

//Get all
generatedWhitePageRouter.get("/generated-white-page/", authMiddleware, generatedWhitePageController.getAll);
