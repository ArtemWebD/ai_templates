import path from "path";
import fs from "fs/promises";
import * as crypto from "crypto";
import zip from "../zip/zip.js";
import { WhitePageModel } from "../../database.js";
import WhitePageDto from "../../dto/whitePage.dto.js";
import ApiError from "../exceptions/api-error.js";
import { whitePageQueue } from "../../bull.js";
import generatedWhitePageService from "../generatedWhitePage/generatedWhitePage.service.js";
import GeneratedWhitePageDto from "../../dto/generatedWhitePage.dto.js";
import DOM from "../DOM/DOM.js";

class WhitePageService {
    /**
     * 
     * @param {string} title template's title
     * @param {Buffer} file binary archive
     * @returns {Promise<void>}
     */
    async upload(title, file) {
        const relativePath = `/static/white-page/${crypto.randomBytes(20).toString("hex")}/`;
        const fullPath = path.resolve() + relativePath;

        await zip.unzip(file, fullPath);

        const htmlPath = fullPath + "/index.html";
        const htmlFile = await fs.readFile(htmlPath);

        const html = DOM.addJsonEditor(htmlFile, process.env.CLIENT_URL);

        await fs.writeFile(htmlPath, html);
        await WhitePageModel.create({ title, path: relativePath });
    }

    /**
     * 
     * @returns {Promise<WhitePageDto[]>}
     */
    async getAll() {
        const whitePages = await WhitePageModel.findAll();

        return whitePages.map((value) => new WhitePageDto(value));
    }

    /**
     * 
     * @param {number} id white page's id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        const fullPath = path.resolve() + whitePage.path;

        await fs.rm(fullPath, { recursive: true, force: true });
        await WhitePageModel.destroy({ where: { id } });
    }

    /**
     * 
     * @param {number} id white page's id
     * @param {string} prompt user's prompt
     * @param {number} userId user's id
     * @returns {Promise<GeneratedWhitePageDto>}
     */
    async generateWhitePage(id, prompt, userId) {
        //Check existing of template
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        const title = crypto.randomBytes(20).toString("hex");
        
        const job = await whitePageQueue.add({ prompt, whitePage, title });
        const generatedWhitePage = await generatedWhitePageService.create(title, whitePage.id, userId, job.id);

        return new GeneratedWhitePageDto(generatedWhitePage);
    }

    /**
     * 
     * @param {number} id white page's id
     * @returns {Promise<string>}
     */
    async getJson(id) {
        const fullPath = await this.__getJsonPath(id);

        try {
            await fs.access(fullPath);
        } catch (error) {
            await fs.writeFile(fullPath, "[]");
        }

        return fs.readFile(fullPath, { encoding: "utf8" });
    }

    /**
     * 
     * @param {number} id white page's id 
     * @param {string} json updated json
     * @returns {Promise<void>}
     */
    async updateJson(id, json) {
        const fullPath = await this.__getJsonPath(id);

        await fs.writeFile(fullPath, json);
    }

    async __getJsonPath(id) {
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        return path.join(path.resolve(), whitePage.path, "prompt.json");
    }
}

export default new WhitePageService();
