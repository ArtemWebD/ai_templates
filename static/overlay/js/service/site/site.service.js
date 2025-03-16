import { API } from "../../modules/api/api.js";

export default class SiteService {
    /**
     * Save site's changes
     * @param {number} id site's id
     * @param {string} html stringified html
     * @param {string} page page of site
     * @return {Promise<void>}
     */
    static async save(id, html, page) {
        await API.post("/site/save", { id, html, page });
    }

    /**
     * Get archive to download
     * @param {number} id site's id
     * @returns {Promise<Axios.Axios.XHR<{ zipPath: string }>>}
     */
    static async download(id) {
        return API.get(`/site/${id}`);
    }
}