import { OpenAI } from "openai";
import { Agent } from "https";
import fs from "fs/promises";
import path from "path";

export default class ChatGPT {
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
        return this.__createPrompt(text, "gpt_history.json");
    }

    async createMetatagsPrompt(text) {
        return this.__createPrompt(text, "gpt_meta_history.json");
    }

    async __createPrompt(text, historyFile) {
        const messages = await this.__writeHistory(text, "user", historyFile);
        const response = await this.__openaiapi.chat.completions.create({
            messages,
            model: 'chatgpt-4o-latest',
        });
        const answer = response.choices[0].message.content;

        await this.__writeHistory(answer, "assistant", historyFile);

        return answer;
    }

    async __writeHistory(text, role, historyFile) {
        // const pathFile = path.join(path.resolve(), historyFile);
        // const file = await fs.readFile(pathFile, { encoding: "utf8" });
        // const data = JSON.parse(file);

        // data.push({ "role": role, "content": text });
        // await fs.writeFile(pathFile, JSON.stringify(data));

        // return data;
        return { "role": role, "content": text }
    }
}