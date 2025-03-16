import APIStore from "../api/apiStore.js";
import SiteService from "../../service/site/site.service.js";

export default class SiteStore extends APIStore {
    _id;
    _page;

    constructor() {
        super();

        this.init();
    }

    get id() {
        return this._id;
    }

    get page() {
        return this._page;
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);

        this._id = +urlParams.get("id");
        this._page = urlParams.get("page");
    }

    async save() {
        try {
            this.__startRequest();

            const html = document.documentElement.outerHTML;

            await SiteService.save(this._id, html, this._page);

            this.__endRequest("Страница успешно сохранена");
        } catch (error) {
            this.__handleError(error);
        }
    }

    /**
     * @returns {Promise<string | undefined>} link to download
     */
    async download() {
        try {
            this.__startRequest();

            const response = await SiteService.download(this._id);

            this.__endRequest("Страница успешно подготовлена к загрузке");

            return `http://${window.location.host}${response.data.zipPath}`;
        } catch (error) {
            this.__handleError(error);
        }
    }
}