import { APIRequest } from "../../modules/api/api.js";
import WhitePage from "../../modules/white-page/white-page.js";
import Prompt from "./prompt.js";

export default class WhitePageForm {
    __id;

    __form;

    __prompt;
    __apiRequest = new APIRequest();
    __whitePage = new WhitePage();

    constructor() {
        this.__form = this.__setForm();
        this.__prompt = new Prompt(this.__form);

        this.__getWhitePages();
        this.__formHandler();
    }

    __setForm() {
        const form = document.getElementById("whitePageForm");

        if (!form) {
            throw new Error("Element was not found");
        }

        return form;
    }

    __formHandler() {
        this.__form.onsubmit = async (e) => {
            e.preventDefault();

            const prompt = this.__prompt.toString();

            if (!prompt || !this.__id) {
                return;
            }

            await this.__whitePage.create(this.__id, prompt);

            this.__form.reset();
        }
    }

    async __getWhitePages() {
        const container = document.querySelector(".white-page-templates");

        if (!container) {
            return;
        }

        const templates = await this.__whitePage.getAll();

        const html = templates.reduce((acc, value) => {
            const uri = encodeURI(`http://${window.location.host}${value.path}`);
            acc += `
                <div class="col" data-id="${value.id}">
                    <h3>${value.title}</h3>
                    <iframe class="mt-2" src="${uri}" frameborder="0" width="1280" height="1280" scrolling="no">
                    </iframe>
                    <div class="templates__select">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                        </svg>
                    </div>
                </div>
            `;

            return acc;
        }, "");

        container.innerHTML = html;

        this.__selectHandler();
    }

    async __selectHandler() {
        const templates = document.querySelectorAll(".white-page-templates .col");

        templates.forEach((el) => {
            el.onclick = () => {
                this.__id = +el.dataset.id;
                el.classList.add("template__selected");

                this.__removeSelected();
            }
        })
    }

    __removeSelected() {
        const selected = document.querySelector(".whitepage-templates .template__selected");

        if (selected) {
            selected.classList.remove("template__selected");
        }
    }
}