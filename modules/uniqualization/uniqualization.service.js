import path from "path";
import fs from "fs/promises";
import chatGPT from "../chatGPT/chatGPT.js";
import siteService from "../site/site.service.js";
import imageManager from "../imageManager/imageManager.js";

class UniqualizationService {
    async unique(prompt, text, language) {
        let gptPrompt = prompt;

        if (!prompt) {
            gptPrompt = await this.getPromptFromFile();
        }

        if (language) {
            gptPrompt += "\nЯзык ответа: " + language;
        }

        gptPrompt += ":\n" + text;

        const response = await chatGPT.createUniquePrompt(gptPrompt);

        return response;
    }

    async getPromptFromFile() {
        const pathPrompt = path.resolve() + "/prompts/unique.txt";
        return fs.readFile(pathPrompt, { encoding: "utf8" });
    }

    async uniqueMetatags(title, description, keywords) {
        const response = {
            title: "",
            description: "",
            keywords: "",
        }
        
        if (title) {
            response.title = await chatGPT.createMetatagsPrompt(
                "Напиши html тэг title\n" + title
            );
        }

        if (description) {
            response.description = await chatGPT.createMetatagsPrompt(
                "Напиши html тэг <meta name='description'>\n" + description
            );
        }

        if (keywords) {
            response.description = await chatGPT.createMetatagsPrompt(
                "Напиши html тэг <meta name='keywords'>\n" + keywords
            );
        }

        return response;
    }

    async uploadImage(user, id, file) {
        const site = await siteService.getSiteByUserAndId(user, id);

        const directoryName = "overlay-images/";
        const filename = await imageManager.writeImage(path.resolve() + site.path + "/" + directoryName, path.extname(file.originalname), file.buffer);
        const imagePath = directoryName + filename;

        return imagePath;
    }
}

export default new UniqualizationService();