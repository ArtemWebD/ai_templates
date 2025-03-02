import WhitePage from "../../../modules/white-page/white-page.js";

/**
 * Adapter for white page list
 */
export default class WhitePageAdapter extends WhitePage {
    /**
     * Upload new white page's template
     * @param {FormData} data white page template's title and zip archive
     * @returns {Promise<void>}
     */
    async create(data) {
        return this.upload(data);
    }
}