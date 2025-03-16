import { API } from "../../modules/api/api.js";

export default class MetatagsService {
    /**
     * 
     * @param {string | undefined} title 
     * @param {string | undefined} description 
     * @param {string | undefined} keywords 
     * @returns {Promise<Axios.AxiosXHR<{ result: Object }>>}
     */
    static async unify(title, description, keywords) {
        return API.post("/uniqualization/metatags", { title, description, keywords });
    }
}