import path from "path";
import fs from "fs/promises";
import chatGPT from "../chatGPT/chatGPT.js";
import siteService from "../site/site.service.js";
import imageManager from "../imageManager/imageManager.js";

class UniqualizationService {
    /**
     * 
     * @param {string} prompt user's prompt
     * @param {string} text serialized html
     * @param {string} language language of answer
     * @returns {Promise<string>}
     */
    async unique(prompt, text, language) {
        let gptPrompt = prompt;

        if (!prompt) {
            gptPrompt = await this.getPromptFromFile();
        }

        if (language) {
            gptPrompt += "\nЯзык ответа: " + language;
        }

        gptPrompt += ":\n" + JSON.stringify(text);

        const response = await chatGPT.createUniquePrompt(gptPrompt);

        return response;
    }

    /**
     * Get default prompt from txt file
     * @returns {Promise<string>}
     */
    async getPromptFromFile() {
        const pathPrompt = path.resolve() + "/prompts/unique.txt";
        return fs.readFile(pathPrompt, { encoding: "utf8" });
    }

    /**
     * 
     * @param {string} title title metatag prompt
     * @param {string} description description metatag prompt
     * @param {string} keywords keywords metatag prompt
     * @returns {Promise<{ title: string, description: string, keywords: string }>}
     */
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

    /**
     * Upload user's image to site
     * @param {UserDto} user user's object
     * @param {number} id site's id
     * @param {Buffer} file binary image
     * @returns {Promise<string>}
     */
    async uploadImage(user, id, file) {
        const site = await siteService.getSiteByUserAndId(user, id);

        const directoryName = "overlay-images/";
        const filename = await imageManager.writeImage(path.resolve() + site.path + "/" + directoryName, path.extname(file.originalname), file.buffer);
        const imagePath = directoryName + filename;

        return imagePath;
    }
}

export default new UniqualizationService();