import { APIRequest } from "../api/api.js";

/**
 * Module for using generate token API
 */
export default class GenerateTokenAPI {
    __APIRequest = new APIRequest();

    /**
     * 
     * @param {{ userId: number, count: number }} data user's id and count of usage 
     * @returns {{ id: number, token: string, createdAt: string, count: number }}
     */
    async create(data) {
        const response = await this.__APIRequest.createRequest({ method: "post", url: "/generate-token", data });

        return response.data.generateToken;
    }

    /**
     * @param {number | undefined} userId user's id
     * @returns {{ id: number, token: string, createdAt: string, count: number }[]}
     */
    async getAll(userId) {
        const data = { userId };
        const response = await this.__APIRequest.createRequest({ method: "post", url: "/generate-token/all", data });

        return response.data.generateTokens;
    }

    /**
     * Increase count of token usage
     * @param {{ token: string, count: number }} data 
     */
    async increaseCount(data) {
        await this.__APIRequest.createRequest({ method: "put", url: "/generate-token", data }, "Количество использований увеличено");
    }
}