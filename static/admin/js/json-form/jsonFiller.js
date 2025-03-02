import TextInputFiller from "../../../modules/input-filler/textInputFiller.js";
import WhitePage from "../../../modules/white-page/white-page.js";

/**
 * Module for filling json input
 */
export default class JsonFiller {
    __whitePageAPI = new WhitePage();
    __inputFiller;

    /**
     * @param {HTMLFormElement} form 
     * @param {string | number} id 
     */
    constructor(form, id) {
        this.__input = form.querySelector(`textarea[name="json"]`);
        this.__inputFiller = new TextInputFiller(this.__input);
        this.__id = id;
    }

    /**
     * Fill input
     */
    async fill() {
        const json = await this.__whitePageAPI.getJson(this.__id);

        this.__inputFiller.fill(json);
    }
}