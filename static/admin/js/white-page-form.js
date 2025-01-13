import WhitePage from "../../modules/white-page/white-page.js";
import WhitePageList from "./white-page-list.js";

export default class WhitePageForm {
    __whitePage = new WhitePage();
    __whitePageList = new WhitePageList();

    constructor() {
        this.__formHandler();
    }

    __formHandler() {
        const form = document.getElementById("uploadWhitePage");

        if (!form) {
            return;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();

            const title = form.querySelector("#title");
            const siteArchive = form.querySelector("#siteArchive");

            if (!title || !siteArchive) {
                return;
            }

            await this.__whitePage.upload(title.value, siteArchive.files[0]);

            await this.__whitePageList.getTemplates();

            form.reset();
        }
    }
}