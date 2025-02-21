import { APIRequest } from "../api/api.js";

/**
 * Module for creating requests for white page API
 */
export default class WhitePage {
    __apiRequest = new APIRequest();

    /**
     * Upload new white page's template
     * @param {string} title white page template's title
     * @param {File} file zip archive of template
     * @returns {Promise<void>}
     */
    async upload(title, file) {
        const data = new FormData();

        data.append("title", title);
        data.append("site", file);

        await this.__apiRequest.createRequest({ url: "/white-page/upload", method: "post", data }, "Шаблон успешно добавлен");
    }

    /**
     * 
     * @returns {Promise<{ id: number, title: string, path: string }[]>}
     */
    async getAll() {
        const response = await this.__apiRequest.createRequest({ url: "/white-page/", method: "get" });

        if (!response) {
            return;
        }

        return response.data.whitePages;
    }

    /**
     * 
     * @param {number | string} id white page's id
     * @returns {Promise<void>}
     */
    async remove(id) {
        await this.__apiRequest.createRequest({ url: `/white-page/${id}`, method: "delete" });
    }

    /**
     * 
     * @param {number | string} id white page's id
     * @returns {Promise<string>}
     */
    async getJson(id) {
        const response = await this.__apiRequest.createRequest({ url: `/white-page/json/${id}`, method: "get" });

        if (!response) {
            return;
        }

        return response.data.json;
    }

    /**
     * 
     * @param {number | string} id white page's id
     * @param {string} json json object
     * @returns {Promise<void>}
     */
    async updateJson(id, json) {
        await this.__apiRequest.createRequest({ url: "/white-page/json", method: "put", data: { id, json } }, "Изменения успешно сохранены");
    }

    /**
     * 
     * @param {number | string} id white page's id
     * @param {string} prompt prompt for generating
     * @returns {Promise<void>}
     */
    async create(id, prompt) {
        await this.__apiRequest.createRequest(
            { url: "/white-page/create", method: "post", data: { id, prompt } },
            "Ваш запрос успешно поставлен в очередь"
        );
    }

    /**
     * 
     * @returns {Promise<{ id: number, status: string, whitePageId: number, title: string, whitePageTitle: string }[]>}
     */
    async getTasks() {
        const response = await this.__apiRequest.createRequest({ url: "/generated-white-page", method: "get" });

        if (!response) {
            return;
        }

        return response.data.tasks;
    }
}