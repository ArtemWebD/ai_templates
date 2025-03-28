import ApiError from "../exceptions/api-error.js";
import whitePageService from "./whitePage.service.js";

class WhitePageController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async uploadTemplate(req, res, next) {
        try {
            const { title } = req.body;
            const file = req.file.buffer;

            const whitePage = await whitePageService.upload(title, file);

            res.json({ whitePage });
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
    async getAll(req, res, next) {
        try {
            const whitePages = await whitePageService.getAll();

            res.json({ whitePages });
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
    async remove(req, res, next) {
        try {
            const id = +req.params.id;

            if (isNaN(id)) {
                return next(ApiError.BadRequest("Неверно указан шаблон"));
            }

            await whitePageService.remove(id);

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
    async create(req, res, next) {
        try {
            const { id, prompt } = req.body;
            const user = req.user;
            const token = req.generateToken;

            const task = await whitePageService.generateWhitePage(id, prompt, user.id, token);

            res.json({ task });
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
    async getJson(req, res, next) {
        try {
            const id = +req.params.id;

            if (isNaN(id)) {
                return next(ApiError.BadRequest("Неверно указан шаблон"));
            }

            const json = await whitePageService.getJson(id);

            res.json({ json });
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
    async updateJson(req, res, next) {
        try {
            const { id, json } = req.body;

            await whitePageService.updateJson(id, json);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new WhitePageController();
