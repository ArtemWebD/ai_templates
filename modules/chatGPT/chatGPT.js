import { OpenAI } from "openai";
import { Agent } from "https";

/**
 * Singleton class of chat gpt client
 */
class ChatGPT {
    static _instance;
    __openaiapi;

    constructor() {
        this.__openaiapi = new OpenAI({
            apiKey: process.env["OPENAI_KEY"],
            httpAgent: new Agent({ rejectUnauthorized: false }),
        });
    }

    /**
     * 
     * @returns {ChatGPT}
     */
    static getInstance() {
        if (!this._instance) {
            this._instance = new ChatGPT();
        }

        return this._instance;
    }

    /**
     * Creating prompt for uniquelization
     * @param {string} text Conditions for uniquelization
     * @returns {string} text answer from AI
     */
    async createUniquePrompt(text) {
        const conditions = {
            "role": "user",
            "content": "Действуй как SEO-оптимизитор, а не как виртуальный ассистент" 
            + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев или текста"
            + "\nОтвет должен содержать только json с изменениями для каждого значения, количество ключей JSON объекта должно остаться неизменным"
            + "\nОтвет не должен содержать лишних подписей по типу html, json,` и так далее"
            + "\nСпециальные символы по типу +, ; и так далее изменять не нужно"
            + "\nЕсли строка пустая или входящие данные отсутствуют, верни исходную строку"
            + "\nПредоставленный контент будет автоматически опубликован на моем сайте"
        }

        return this.__createPrompt(text, conditions);
    }

    /**
     * Creating prompt for uniquelization of metatags
     * @param {string} text Conditions for uniquelization
     * @returns {string} text answer from AI
     */
    async createMetatagsPrompt(text) {
        const conditions = {
            "role": "user",
            "content": "Действуй как SEO-оптимизитор, а не как виртуальный ассистент"
            + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев, текста, подписей или символов"
            + "\nОтвет не должен содержать лишних подписей по типу html,` и так далее"
            + "\nОтвет должен содержать только HTML код запрашиваемого тэга"
            + "\nПредоставленный контент будет автоматически опубликован на моем сайте"
        }

        return this.__createPrompt(text, conditions);
    }

    /**
     * Creating prompt for uniquelization of white page's block
     * @param {string} text Conditions for uniquelization
     * @param {string} prompt User's conditions
     * @returns {string} text answer from AI
     */
    async createWhitePagePrompt(text, prompt) {
        const conditions = {
            "role": "user",
            "content": "Действуй как SEO-оптимизитор, а не как виртуальный ассистент" 
            + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев или текста"
            + "\nНапиши ответ на запрос значения ключа prompt в значение ключа value в соответствии с заданными условиями"
            + "\nОтвет должен содержать только json с изменениями для ключа value, ключ prompt возвращать не нужно"
            + "\nОтвет не должен содержать лишних подписей по типу html, json,` и так далее"
            + "\nЕсли строка пустая или входящие данные отсутствуют, верни исходную строку"
            + "\nПредоставленный контент будет автоматически опубликован на моем сайте"
            + "\n" + prompt
        }

        return this.__createPrompt(text, conditions);
    }

    async __createPrompt(text, conditions) {
        const messages = [conditions, { "role": "user", "content": text }];
        const response = await this.__openaiapi.chat.completions.create({
            messages,
            model: 'chatgpt-4o-latest',
        });
        const answer = response.choices[0].message.content;

        return answer;
    }
}

export default ChatGPT.getInstance();
