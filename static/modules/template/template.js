import { APIRequest } from "../api/api.js";

/**
 * Module for template API
 */
export default class TemplateAPI {
    __APIRequest = new APIRequest();

    /**
     * @returns {Promise<{ id: number, title: string, path: string }[]>}
     */
    async getAll() {
        const response = await this.__APIRequest.createRequest({ method: "get", url: "/template" });

        return response.data.templates;
    }

    /**
     * @param {FormData} data FormData instance that consist of title and zip archive
     * @returns {Promise<void>}
     */
    async create(data) {
        const response = await this.__APIRequest.createRequest({
            method: "post",
            url: "/template/upload",
            data
        });

        return response.data.template;
    }

    /**
     * @param {string | number} id template's id
     * @returns {Promise<void>}
     */
    async remove(id) {
        await this.__APIRequest.createRequest({ method: "delete", url: `/template/${id}` });
    }
}