import GenerateTokenAPI from "../../../modules/generate-token/generateTokenAPI.js"

export default class IncreaseCountAPIAdapter {
    __generateTokenAPI = new GenerateTokenAPI();

    /**
     * Increase count of token usage
     * @param {{ token: string, count: number }} data 
     */
    async create(data) {
        return this.__generateTokenAPI.increaseCount(data);
    }
}