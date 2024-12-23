import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import templateController from "../template/template.controller.js";
import multer from "multer";

export const templateRouter = new Router({ mergeParams: true });
const upload = multer();

//Uploading templates
templateRouter.post("/template/upload", upload.single("site"), authMiddleware, templateController.upload);

//Get all templates
templateRouter.get("/template", authMiddleware, templateController.getTemplates);

//Delete template
templateRouter.delete("/template/:id", authMiddleware, templateController.deleteTemplate);