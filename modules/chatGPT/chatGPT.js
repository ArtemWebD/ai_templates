import { OpenAI } from "openai";
import { Agent } from "https";

class ChatGPT {
    static _instance;
    __openaiapi;

    constructor() {
        this.__openaiapi = new OpenAI({
            apiKey: process.env["OPENAI_KEY"],
            httpAgent: new Agent({ rejectUnauthorized: false }),
        });
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new ChatGPT();
        }

        return this._instance;
    }

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

        return this.__createPrompt(text, "gpt_history.json", conditions);
    }

    async createMetatagsPrompt(text) {
        const conditions = {
            "role": "user",
            "content": "Действуй как SEO-оптимизитор, а не как виртуальный ассистент"
            + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев, текста, подписей или символов"
            + "\nОтвет не должен содержать лишних подписей по типу html,` и так далее"
            + "\nОтвет должен содержать только HTML код запрашиваемого тэга"
            + "\nПредоставленный контент будет автоматически опубликован на моем сайте"
        }

        return this.__createPrompt(text, "gpt_meta_history.json", conditions);
    }

    async __createPrompt(text, historyFile, conditions) {
        const messages = await this.__writeHistory(text, "user", conditions);
        const response = await this.__openaiapi.chat.completions.create({
            messages,
            model: 'chatgpt-4o-latest',
        });
        const answer = response.choices[0].message.content;

        await this.__writeHistory(answer, "assistant", conditions);

        return answer;
    }

    async __writeHistory(text, role, conditions) {
        // const pathFile = path.join(path.resolve(), historyFile);
        // const file = await fs.readFile(pathFile, { encoding: "utf8" });
        // const data = JSON.parse(file);

        // data.push({ "role": role, "content": text });
        // await fs.writeFile(pathFile, JSON.stringify(data));

        // return data;
        return [conditions, { "role": role, "content": text }];
    }
}

export default ChatGPT.getInstance();
