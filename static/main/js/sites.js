import { APIRequest } from "../../modules/api/api.js";

export default class Sites {
    __APIRequest = new APIRequest();

    async getSites() {
        const response = await this.__APIRequest.createRequest({ method: "get", url: "/site" });
        const container = document.querySelector(".templates_sites .templates__container");

        if (!container) {
            return;
        }

        const html = response.data.sites.reduce((acc, value) => {
            const uri = encodeURI(`http://${window.location.host}${value.path}?id=${value.id}`);
            acc += `
                <div class="col">
                    <h3>${value.title}</h3>
                    <iframe class="mt-2" src="${uri}" frameborder="0" width="1280" height="1280" scrolling="no">
                    </iframe>
                    <a class="templates__link" href="${uri}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
                        </svg>
                    </a>
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
    }

    async createSite(title, templateId) {
        await this.__APIRequest.createRequest({
            method: "post",
            url: "/site/upload",
            data: { title, templateId }
        });
        await this.getSites();
    }

    __deleteTemplateHandler() {
        const elements = document.querySelectorAll(".templates_sites .templates__delete");

        elements.forEach((el) => {
            el.onclick = async () => {
                const id = el.dataset.id;

                await this.__APIRequest.createRequest({ method: "delete", url: `/site/${id}` });
                await this.getSites();
            }
        });
    }
}