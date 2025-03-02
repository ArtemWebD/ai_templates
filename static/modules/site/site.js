import { APIRequest } from "../api/api.js";

/**
 * Module for site API
 */
export default class SiteAPI {
    __APIRequest = new APIRequest();

    /**
     * @returns {Promise<{ id: number, title: string, path: string }[]>}
     */
    async getAll() {
        const response = await this.__APIRequest.createRequest({ method: "get", url: "/site" });

        return response.data.sites;
    }

    /**
     * @param {{ title: string, templateId: string | number }} data site's data
     * @returns {Promise<{ id: number, title: string, path: string }>}
     */
    async create(data) {
        const response = await this.__APIRequest.createRequest({
            method: "post",
            url: "/site/upload",
            data
        });

        return response.data.site;
    }
    
    /**
     * @param {string | number} id site's id
     * @returns {Promise<void>}
     */
    async remove(id) {
        await this.__APIRequest.createRequest({ method: "delete", url: `/site/${id}` });
    }
}