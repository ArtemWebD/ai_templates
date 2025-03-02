import { Router } from "express";
import multer from "multer";
import authMiddleware from "../../middlewares/auth.middleware.js";
import superAuthMiddleware from "../../middlewares/superAuth.middleware.js";
import generateTokenMiddleware from "../../middlewares/generateToken.middleware.js";
import whitePageController from "../white-page/whitePage.controller.js";

export const whitePageRouter = new Router();
const upload = multer();

//Upload template
whitePageRouter.post("/white-page/upload", upload.single("site"), authMiddleware, superAuthMiddleware, whitePageController.uploadTemplate);

//Get all templates
whitePageRouter.get("/white-page/", authMiddleware, whitePageController.getAll);

//Remove template
whitePageRouter.delete("/white-page/:id", authMiddleware, superAuthMiddleware, whitePageController.remove);

//Generate site by template
whitePageRouter.post("/white-page/create", authMiddleware, generateTokenMiddleware, whitePageController.create);

//Get json file of template
whitePageRouter.get("/white-page/json/:id", authMiddleware, superAuthMiddleware, whitePageController.getJson);

//Edit json file of template
whitePageRouter.put("/white-page/json", authMiddleware, superAuthMiddleware, whitePageController.updateJson);
