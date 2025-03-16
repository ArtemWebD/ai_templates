import path from "path";
import fs from "fs/promises";
import zip from "../zip/zip.js";
import { TemplateModel } from "../../database.js";
import TemplateDto from "../../dto/template.dto.js";
import ApiError from "../exceptions/api-error.js";
import FileSystemService from "../file-system/fileSystem.service.js";

class TemplateService {
    /**
     *
     * @param {Buffer} file binary zip archive
     * @param {string} title template's title
     * @param {UserDto} user user's object
     * @returns {Promise<TemplateDto>}
     */
    async createTemplate(file, title, user) {
        const templateRelativePath = "/static/templates/" + title;
        const templatePath = path.resolve() + templateRelativePath;

        await zip.unzip(file, templatePath);

        const pages = await FileSystemService.getFilesByExtension(templatePath, ".html");

        const template = await TemplateModel.create({
            userId: user.id,
            title: title,
            path: templateRelativePath,
            pages,
        });
        const templateData = new TemplateDto(template);

        return templateData;
    }

    /**
     * 
     * @param {UserDto} user user's object
     * @returns {Promise<TemplateDto[]>}
     */
    async getTemplates(user) {
        const templates = await TemplateModel.findAll({ where: { userId: user.id } });
        const templateDataArray = templates.map((value) => new TemplateDto(value));

        return templateDataArray;
    }

    /**
     * 
     * @param {UserDto} user user's object
     * @param {number} id template's id
     * @returns {Promise<void>} 
     */
    async deleteTemplate(user, id) {
        const template = await TemplateModel.findOne({ where: { id, userId: user.id } });

        if (!template) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        const templatePath = path.resolve() + template.path;

        await TemplateModel.destroy({ where: { id } });
        await fs.rm(templatePath, { recursive: true, force: true });
    }

    /**
     * 
     * @param {number} id template's id
     * @returns {Promise<TemplateModel>}
     */
    async findById(id) {
        return TemplateModel.findOne({ where: { id } });
    }
}

export default new TemplateService();