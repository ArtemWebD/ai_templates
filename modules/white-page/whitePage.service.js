import path from "path";
import fs from "fs/promises";
import * as crypto from "crypto";
import zip from "../zip/zip.js";
import WhitePageModel from "../../models/whitePage.model.js";
import WhitePageDto from "../../dto/whitePage.dto.js";
import ApiError from "../exceptions/api-error.js";
import chatGPT from "../chatGPT/chatGPT.js";
import DOM from "../DOM/DOM.js";

class WhitePageService {
    async upload(title, file) {
        const relativePath = `/static/white-page/${crypto.randomBytes(20).toString("hex")}/`;
        const fullPath = path.resolve() + relativePath;

        await zip.unzip(file, fullPath);
        await WhitePageModel.create({ title, path: relativePath });
    }

    async getAll() {
        const whitePages = await WhitePageModel.findAll();

        return whitePages.map((value) => new WhitePageDto(value));
    }

    async remove(id) {
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        const fullPath = path.resolve() + whitePage.path;

        await fs.rm(fullPath, { recursive: true, force: true });
        await WhitePageModel.destroy({ where: { id } });
    }

    async generateWhitePage(id, prompt) {
        //Check existing of template
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        //Copy template's file to site's directory
        const dirName = crypto.randomBytes(20).toString("hex");
        const siteRelativePath = "/static/white-page_sites/" + crypto.randomBytes(20).toString("hex");
        const sourcePath = path.resolve() + whitePage.path;
        const destinationPath = path.resolve() + siteRelativePath;

        await fs.cp(sourcePath, destinationPath, { recursive: true });

        //Read json file and delete it
        const jsonPath = destinationPath + "/prompt.json";
        const jsonFile = await fs.readFile(jsonPath, { "encoding": "utf8" });

        await fs.rm(jsonPath);

        const promptArray = JSON.parse(jsonFile);

        //Create prompts for chatGPT
        for (const condition of promptArray) {
            //Get response from chatGPT
            const json = JSON.stringify({ prompt: condition.prompt });
            const response = await chatGPT.createWhitePagePrompt(json, prompt);
            const changes = { selectors: condition.selectors, value: JSON.parse(response).value };

            //Change html elements and write
            const htmlPath = destinationPath + "/index.html";
            const html = await fs.readFile(htmlPath);
            const resultHtml = DOM.writeElementChanges(html, changes);

            await fs.writeFile(htmlPath, resultHtml);
        }

        await zip.zip(destinationPath, dirName);

        return dirName + ".zip";
    }

    async getJson(id) {
        const fullPath = await this.__getJsonPath(id);

        try {
            await fs.access(fullPath);
        } catch (error) {
            await fs.writeFile(fullPath, "[]");
        }

        return fs.readFile(fullPath, { encoding: "utf8" });
    }

    async updateJson(id, json) {
        const fullPath = await this.__getJsonPath(id);

        await fs.writeFile(fullPath, json);
    }

    async __getJsonPath(id) {
        const whitePage = await WhitePageModel.findOne({ where: { id } });

        if (!whitePage) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        return path.resolve() + whitePage.path + "/prompt.json";
    }
}

export default new WhitePageService();
