import store from "../../store/store.js";

export default class SaveMenuComponent {
    _container;

    _siteStore = store.siteStore;

    init() {
        this.render();

        const saveButton = this._container.querySelector("#saveTemplate");
        const downloadButton = this._container.querySelector("#downloadTemplate");

        if (!saveButton || !downloadButton) {
            return;
        }

        saveButton.onclick = async () => {
            await this._siteStore.save();
        }

        downloadButton.onclick = async (e) => {
            e.preventDefault();

            const link = await this._siteStore.download();

            if (!link) {
                return;
            }

            window.location.href = link;
        }
    }

    render() {
        const container = document.createElement("div");
        container.classList.add("overlay-menu", "overlay-element");

        container.innerHTML = `
            <button class="overlay-button" id="saveTemplate">Сохранить</button>
            <a class="overlay-link" id="downloadTemplate">Скачать</a>
        `;

        document.body.append(container);
        this._container = container;
    }
}