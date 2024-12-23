import ApiError from "../exceptions/api-error.js";
import templateService from "./template.service.js";

class TemplateController {
    async upload(req, res, next) {
        try {
            const file = req.file.buffer;
            const title = req.body.title;
            const user = req.user;

            const templateData = await templateService.createTemplate(file, title, user);

            res.json(templateData);
        } catch (error) {
            next(error);
        }
    }

    async getTemplates(req, res, next) {
        try {
            const user = req.user;

            const templateDataArray = await templateService.getTemplates(user);

            res.json({ templates: templateDataArray });
        } catch (error) {
            next(error);
        }
    }

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