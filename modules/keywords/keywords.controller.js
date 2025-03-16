import ApiError from "../exceptions/api-error.js";
import keywordsService from "./keywords.service.js";

class KeywordsController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async getBySelector(req, res, next) {
        try {
            const templateId = +req.query.templateId;

            if (isNaN(templateId)) {
                return next(ApiError.BadRequest("Некорректно указан шаблон"));
            }

            const selector = decodeURIComponent(req.query.selector);
            const page = decodeURIComponent(req.query.page);

            const keywords = await keywordsService.getBySelector(templateId, selector, page);

            res.json({ keywords });
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
    async create(req, res, next) {
        try {
            const { templateId, selector, words, page } = req.body;

            const keywords = await keywordsService.create(templateId, selector, words, page);

            res.json({ keywords });
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
    async update(req, res, next) {
        try {
            const { templateId, selector, words, page } = req.body;

            const keywords = await keywordsService.update(templateId, selector, words, page);

            res.json({ keywords });
        } catch (error) {
            next(error);
        }
    }
}

export default new KeywordsController();
