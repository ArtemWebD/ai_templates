import siteService from "./site.service.js";

class SiteController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async upload(req, res, next) {
        try {
            const { templateId, title } = req.body;
            const user = req.user;

            const site = await siteService.createSite(templateId, title, user);

            res.json({ site });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async getSites(req, res, next) {
        try {
            const user = req.user;

            const siteDataArray = await siteService.getSites(user);

            res.json({ sites: siteDataArray });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async download(req, res, next) {
        try {
            const user = req.user;

            const { id } = req.params;
            const idNumber = +id;

            if (isNaN(idNumber)) {
                throw ApiError.BadRequest("Неверно указан шаблон");
            }

            const zipPath = await siteService.cleanSite(user, id);

            res.json({ zipPath });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async deleteSite(req, res, next) {
        try {
            const user = req.user;

            const { id } = req.params;
            const idNumber = +id;

            if (isNaN(idNumber)) {
                throw ApiError.BadRequest("Неверно указан шаблон");
            }

            await siteService.deleteSite(user, id);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async saveChanges(req, res, next) {
        try {
            const user = req.user;
            const { id, html } = req.body;

            await siteService.saveChanges(user, id, html);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new SiteController();