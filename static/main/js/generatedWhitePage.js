import WhitePage from "../../modules/white-page/white-page.js";

export default class GeneratedWhitePage {
    __whitePage = new WhitePage();

    __form;

    constructor() {
        this.__form = document.getElementById("generatedWhitePageForm");

        if (!this.__form) {
            throw new Error("Form element was not found");
        }

        this.getAll();
        this.__refreshHandler();
    }

    async getAll() {
        const table = this.__form.querySelector(".table tbody");

        if (!table) {
            return;
        } 

        const tasks = await this.__whitePage.getTasks();
        const html = tasks.reduce((acc, task) => {
            const downloadButton = `<a href="http://${window.location.host}/static/ready/${task.title}.zip">Скачать</a>`;
            
            acc += `
                <tr>
                    <td>${task.title}</td>
                    <td>${task.whitePageTitle}</td>
                    <td>${task.status}</td>
                    <td>
                        ${task.status === "Готово" ? downloadButton : ""}
                    </td>
                </tr>
            `;

            return acc;
        }, "");

        table.innerHTML = html;
    }

    __refreshHandler() {
        const button = this.__form.querySelector(".form-refresh");

        if (!button) {
            return;
        }

        button.onclick = async (e) => {
            e.preventDefault();

            await this.getAll();
        }
    }
}