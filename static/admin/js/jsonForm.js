import WhitePage from "../../modules/white-page/white-page.js";

export default class JsonForm {
    __whitePage = new WhitePage();

    __form;

    __id;

    constructor() {
        this.__form = document.getElementById("uploadJson");

        if (!this.__form) {
            throw new Error("Element was not found");
        }

        this.__formHandler();
    }

    async setId(id) {
        this.__id = id;

        await this.__setJson();
    }

    async __setJson() {
        const input = this.__form.querySelector("textarea");

        if (!input) {
            return;
        }

        input.value = await this.__whitePage.getJson(this.__id);
    }

    __formHandler() {
        this.__form.onsubmit = async (e) => {
            e.preventDefault();

            const input = this.__form.querySelector("textarea");

            if (!input || !input.value) {
                return;
            }

            await this.__whitePage.updateJson(this.__id, input.value);
        }
    }
}