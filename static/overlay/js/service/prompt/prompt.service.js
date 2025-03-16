import { API } from "../../modules/api/api.js";

export default class PromptService {
    /**
     * 
     * @returns {Promise<Axios.AxiosXHR<{ prompt: string }>>}
     */
    static async getPrompt() {
        return API.get("/uniqualization/unique");
    }

    /**
     * 
     * @param {Object} text element's text content
     * @param {string} prompt user's prompt
     * @param {string | undefined} language prompt language
     * @returns {Promise<Axios.AxiosXHR<{ result: string }>>}
     */
    static async unify(text, prompt, language) {
        return API.post("/uniqualization/unique", { text, prompt, language });
    }
}