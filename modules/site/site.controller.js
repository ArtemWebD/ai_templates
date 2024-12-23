import siteService from "./site.service.js";

class SiteController {
    async upload(req, res, next) {
        try {
            const { templateId, title } = req.body;
            const host = req.headers.host;
            const user = req.user;

            const siteData = await siteService.createSite(templateId, title, host, user);

            res.json(siteData);
        } catch (error) {
            next(error);
        }
    }

    async getSites(req, res, next) {
        try {
            const user = req.user;

            const siteDataArray = await siteService.getSites(user);

            res.json({ sites: siteDataArray });
        } catch (error) {
            next(error);
        }
    }

    async download(req, res, next) {
        try {
            const user = req.user;

            const { id } = req.params;
            const idNumber = +id;

            if (isNaN(idNumber)) {
                throw ApiError.BadRequest("Неверно указан шаблон");
            }

            const zipPath = await cleanSite(user, id);

            res.redirect(zipPath);
        } catch (error) {
            next(error);
        }
    }

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