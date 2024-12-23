import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import siteController from "../site/site.controller.js";

export const siteRouter = new Router({ mergeParams: true });

//Upload site
siteRouter.post("/site/upload", authMiddleware, siteController.upload);

//Get all sites
siteRouter.get("/site/", authMiddleware, siteController.getSites);

//Download site
siteRouter.get("/site/:id", authMiddleware, siteController.download);

//Delete site
siteRouter.delete("/site/:id", authMiddleware, siteController.deleteSite);

//Save site's changes
siteRouter.post("/site/save", authMiddleware, siteController.saveChanges);