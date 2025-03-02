import { APIRequest } from "../api/api.js";

/**
 * Module for using user API
 */
export default class UserAPI {
    __APIRequest = new APIRequest();

    /**
     * @returns {Promise<{ id: number, email: string, name: string, type: string }>}
     */
    async getAll() {
        const response = await this.__APIRequest.createRequest({ method: "get", url: "/auth/users" });

        return response.data.users;
    }
}