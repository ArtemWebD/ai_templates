import ApiError from "../exceptions/api-error.js";
import templateService from "./template.service.js";

class TemplateController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async upload(req, res, next) {
        try {
            const file = req.file.buffer;
            const title = req.body.title;
            const user = req.user;

            const template = await templateService.createTemplate(file, title, user);

            res.json({ template });
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
    async getTemplates(req, res, next) {
        try {
            const user = req.user;

            const templateDataArray = await templateService.getTemplates(user);

            res.json({ templates: templateDataArray });
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
    async deleteTemplate(req, res, next) {
        try {
            const user = req.user;
            const { id } = req.params;
            const idNumber = +id;

            if (isNaN(idNumber)) {
                return next(ApiError.BadRequest("Неверно указан шаблон"));
            }

            await templateService.deleteTemplate(user, idNumber);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new TemplateController();