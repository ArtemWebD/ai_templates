import { Router } from "express";
import multer from "multer";
import authMiddleware from "../../middlewares/auth.middleware.js";

export const whitePageRouter = new Router();
const upload = multer();

//Upload template
whitePageRouter.post("/white-page/upload", upload.single("site"), authMiddleware, whitePageController.uploadTemplate);

//Generate site by template
whitePageRouter.post("/white-page/create", authMiddleware, whitePageController.create);
