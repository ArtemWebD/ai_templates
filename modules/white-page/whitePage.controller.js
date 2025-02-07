import ApiError from "../exceptions/api-error.js";
import whitePageService from "./whitePage.service.js";

class WhitePageController {
    async uploadTemplate(req, res, next) {
        try {
            const { title } = req.body;
            const file = req.file.buffer;

            await whitePageService.upload(title, file);

            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const whitePages = await whitePageService.getAll();

            res.json({ whitePages });
        } catch (error) {
            next(error);
        }
    }

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

    async create(req, res, next) {
        try {
            const { id, prompt } = req.body;
            const user = req.user;

            const task = await whitePageService.generateWhitePage(id, prompt, user.id);

            res.json({ task });
        } catch (error) {
            next(error);
        }
    }

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
