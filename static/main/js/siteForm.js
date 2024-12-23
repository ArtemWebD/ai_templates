export default class SiteForm {
    __sites;

    //sites is instance of Sites class
    constructor(sites) {
        this.__sites = sites;
        this.__formHandler();
    }

    __formHandler() {
        const form = document.getElementById("siteUpload");

        if (!form) {
            return;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();

            const title = form.querySelector("#siteTitle");
            const templateId = form.querySelector("#templateName");

            if (!title || !templateId) {
                return;
            }

            await this.__sites.createSite(title.value, templateName.options[templateName.selectedIndex].dataset.id);
            
            form.reset();
        }
    }
}