import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import keywordsController from "../keywords/keywords.controller.js";

export const keywordsRouter = new Router({ mergeParams: true });

//Create keywords
keywordsRouter.post("/keywords/", authMiddleware, keywordsController.create);

//Update keywords
keywordsRouter.put("/keywords/", authMiddleware, keywordsController.update);

//Get keywords
keywordsRouter.get("/keywords/:templateId", authMiddleware, keywordsController.getBySelector);