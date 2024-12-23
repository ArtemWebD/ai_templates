export default class TemplateForm {
    __templates;

    constructor(templates) {
        this.__templates = templates;
        this.__formHandler();
    }

    __formHandler() {
        const form = document.getElementById("uploadSiteArchive");

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

            await this.__templates.createTemplate(title.value, siteArchive.files[0]);

            form.reset();
        }
    }
}