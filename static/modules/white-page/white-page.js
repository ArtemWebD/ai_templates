import { APIRequest } from "../api/api.js";

export default class WhitePage {
    __apiRequest = new APIRequest();

    async upload(title, file) {
        const data = new FormData();

        data.append("title", title);
        data.append("site", file);

        await this.__apiRequest.createRequest({ url: "/white-page/upload", method: "post", data }, "Шаблон успешно добавлен");
    }

    async getAll() {
        const response = await this.__apiRequest.createRequest({ url: "/white-page/", method: "get" });

        if (!response) {
            return;
        }

        return response.data.whitePages;
    }

    async remove(id) {
        await this.__apiRequest.createRequest({ url: `/white-page/${id}`, method: "delete" });
    }

    async getJson(id) {
        const response = await this.__apiRequest.createRequest({ url: `/white-page/json/${id}`, method: "get" });

        if (!response) {
            return;
        }

        return response.data.json;
    }

    async updateJson(id, json) {
        await this.__apiRequest.createRequest({ url: "/white-page/json", method: "put", data: { id, json } }, "Изменения успешно сохранены");
    }

    async create(id, prompt) {
        const response = await this.__apiRequest.createRequest({ url: "/white-page/create", method: "post", data: { id, prompt } });

        if (!response) {
            return;
        }

        return response.data.zip;
    }
}