import PromptService from "../../service/prompt/prompt.service.js";
import APIStore from "../api/apiStore.js";

export default class PromptStore extends APIStore {
    _prompt;

    get prompt() {
        return this._prompt;
    }

    async init() {
        await this.getPrompt();
    }

    async getPrompt() {
        try {
            this.__startRequest();

            const response = await PromptService.getPrompt();

            this._prompt = response.data.prompt;

            this.__endRequest();
        } catch (error) {
            this.__handleError(error);
        }
    }

    /**
     * @param {Object} text element's text content
     * @param {string} prompt user's prompt
     * @param {string | undefined} language prompt language
     * @returns {Promise<Object>}
     */
    async unify(text, prompt, language) {
        try {
            this.__startRequest();

            const response = await PromptService.unify(text, prompt, language);

            this.__endRequest("Текст успешно уникализирован");

            return JSON.parse(response.data.result);
        } catch (error) {
            this.__handleError(error);
        }
    }
}