import { Router } from "express";
import multer from "multer";
import authMiddleware from "../../middlewares/auth.middleware.js";
import uniqualizationController from "../uniqualization/uniqualization.controller.js";

export const uniqualizationRouter = new Router({ path: "/unique" });
const upload = multer();

//Uniqualization
uniqualizationRouter.post("/uniqualization/unique", authMiddleware, uniqualizationController.unique);

//Get uniqualization prompt
uniqualizationRouter.get("/uniqualization/unique", authMiddleware, uniqualizationController.getPrompt);

//Change meta tags
uniqualizationRouter.post("/uniqualization/metatags", authMiddleware, uniqualizationController.uniqueMetatags);

//Change image
uniqualizationRouter.post("/uniqualization/image", upload.single("image"), authMiddleware, uniqualizationController.uploadImage);