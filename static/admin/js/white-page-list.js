import WhitePage from "../../modules/white-page/white-page.js";

export default class WhitePageList {
    __whitePage = new WhitePage();

    //Class of JSON editing form
    __jsonForm;
    //Class of modals
    __modal;

    constructor(jsonForm, modal) {
        this.__jsonForm = jsonForm;
        this.__modal = modal;
    }

    async getTemplates() {
        const container = document.querySelector(".templates .templates__container");

        if (!container) {
            return;
        }

        const templates = await this.__whitePage.getAll();

        const html = templates.reduce((acc, value) => {
            const uri = encodeURI(`http://${window.location.host}${value.path}?id=${value.id}`);
            acc += `
                <div class="col">
                    <h3>${value.title}</h3>
                    <iframe class="mt-2" src="${uri}" frameborder="0" width="1280" height="1280" scrolling="no">
                    </iframe>
                    <a class="templates__link" href="${uri}" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
                        </svg>
                    </a>
                    <button class="templates__edit" data-id="${value.id}" data-target="jsonModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                    </button>
                    <div class="templates__delete" data-id="${value.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </div>
                </div>
            `;

            return acc;
        }, "");

        container.innerHTML = html;

        this.__deleteTemplateHandler();
        this.__editTemplateHandler();
    }

    __editTemplateHandler() {
        const elements = document.querySelectorAll(".templates .templates__edit");

        elements.forEach((el) => {
            el.onclick = async () => {
                const id = +el.dataset.id;

                await this.__jsonForm.setId(id);
                this.__modal.open("jsonModal");
            }
        });
    }

    __deleteTemplateHandler() {
        const elements = document.querySelectorAll(".templates .templates__delete");

        elements.forEach((el) => {
            el.onclick = async () => {
                const id = el.dataset.id;

                await this.__whitePage.remove(id);
                await this.getTemplates();
            }
        });
    }
}