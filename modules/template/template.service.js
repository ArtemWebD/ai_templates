import path from "path";
import fs from "fs/promises";
import zip from "../zip/zip.js";
import { TemplateModel } from "../../database.js";
import TemplateDto from "../../dto/template.dto.js";
import ApiError from "../exceptions/api-error.js";

class TemplateService {
    async createTemplate(file, title, user) {
        const templateRelativePath = "/static/templates/" + title;
        const templatePath = path.resolve() + templateRelativePath;

        await zip.unzip(file, templatePath);

        const template = await TemplateModel.create({
            userId: user.id,
            title: title,
            path: templateRelativePath,
        });
        const templateData = new TemplateDto(template);

        return templateData;
    }

    async getTemplates(user) {
        const templates = await TemplateModel.findAll({ where: { userId: user.id } });
        const templateDataArray = templates.map((value) => new TemplateDto(value));

        return templateDataArray;
    }

    async deleteTemplate(user, id) {
        const template = await TemplateModel.findOne({ where: { id, userId: user.id } });

        if (!template) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        const templatePath = path.resolve() + template.path;

        await TemplateModel.destroy({ where: { id } });
        await fs.rm(templatePath, { recursive: true, force: true });
    }

    async findById(id) {
        return TemplateModel.findOne({ where: { id } });
    }
}

export default new TemplateService();