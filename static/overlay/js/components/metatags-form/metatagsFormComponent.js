import store from "../../store/store.js";

export default class MetatagsFormComponent {
    _id = "metatagsForm";

    _container;

    _titleLabel;
    _descriptionLabel;
    _keywordsLabel;

    _metatagsStore = store.metatagsStore;

    get outerHTML() {
        return `
            <form id=${this._id}>
                <div class="form-group">
                    <div class="overlay-metatags__tag title-tag">
                        ${this._metatagsStore.title || "Тэг title не указан"}
                    </div>
                    <textarea class="overlay-textarea" id="meta-title" name="title" rows="5" placeholder="Введите запрос для тэга title"></textarea>
                </div>
                <div class="form-group">
                    <div class="overlay-metatags__tag description-tag">
                        ${this._metatagsStore.description || "Тэг description не указан"}
                    </div>
                    <textarea class="overlay-textarea" id="meta-description" rows="5" name="description" placeholder="Введите запрос для тэга description"></textarea>
                </div>
                <div class="form-group">
                    <div class="overlay-metatags__tag keywords-tag">
                        ${this._metatagsStore.keywords || "Тэг keywords не указан"}
                    </div>
                    <textarea class="overlay-textarea" id="meta-keywords" rows="5" name="keywords" placeholder="Введите запрос для тэга keywords"></textarea>
                </div>
                <button class="overlay-button">Изменить</button>
            </form>
        `;
    }

    /**
     * @param {string} title
     */
    set title(title) {
        this._titleLabel.innerHTML = title || "Тэг title не указан";
    }

    /**
     * @param {string} description
     */
    set description(description) {
        this._descriptionLabel.innerHTML = description || "Тэг description не указан";
    }

    /**
     * @param {string} keywords
     */
    set keywords(keywords) {
        this._keywordsLabel.innerHTML = keywords || "Тэг keywords не указан";
    }

    init() {
        this.render();

        this.title = this._metatagsStore.title;
        this.description = this._metatagsStore.description;
        this.keywords = this._metatagsStore.keywords;

        this._container.onsubmit = async (e) => {
            e.preventDefault();

            await this._unify();

            e.target.reset();
        }
    }

    render() {
        const container = document.getElementById(this._id);

        this._container = container ? container : this._container;

        this._titleLabel = this._container.querySelector(".title-tag");
        this._descriptionLabel = this._container.querySelector(".description-tag");
        this._keywordsLabel = this._container.querySelector(".keywords-tag");
    }

    /**
     * @param {HTMLFormElement} form
     */
    async _unify() {
        const formData = new FormData(this._container);
        
        const title = formData.get("title")?.trim();
        const description = formData.get("description")?.trim();
        const keywords = formData.get("keywords")?.trim();

        if (!title && !description && !keywords) {
            return;
        }

        await this._metatagsStore.unify(title, description, keywords);
    }
}