import store from "../../store/store.js";

export default class PromptFormComponent {
    _id = "promptForm";

    _container;

    _promptStore = store.promptStore;
    _textNodesStore = store.textNodesStore;
    _sectionStore = store.sectionStore;

    get outerHTML() {
        return `
            <form id="${this._id}">
                <div>Запрос уникализации. Оставьте поле пустым, чтобы использовать стандартный запрос</div>
                <textarea class="overlay-textarea" id="prompt" name="prompt"></textarea>
                <div>Запрос уникализации для заголовков. Оставьте поле пустым, чтобы использовать общий запрос</div>
                <textarea class="overlay-textarea" name="titlePrompt"></textarea>
                <div>Язык, на котором будет возвращен результат. Оставьте поле пустым, чтобы использовать язык по умолчанию (русский)</div>
                <input class="overlay-input" type="text" id="language" name="language" placeholder="Язык (необязательно)"></input>
                <div class="overlay-sidebar__checkbox">
                    <input type="checkbox" id="allBlocks" name="allBlocks" />
                    <label for="allBlocks">Применить запрос ко всем блокам на странице</label>
                </div>
                <button class="overlay-button overlay-sidebar__unique">Уникализировать текст</button>
            </form>
        `;
    }

    /**
     * Initializes the form handler
     * @param {HTMLElement} section 
     */
    init(section) {
        this.render();
        
        this._container.onsubmit = async (e) => {
            e.preventDefault();

            await this._handleForm(section);
        }
    }

    render() {
        this._container = document.getElementById(this._id);
    }

    /**
     * @param {HTMLElement} section 
     */
    async _handleForm(section) {
        const formData = new FormData(this._container);

        const prompt = formData.get("prompt");
        const titlePrompt = formData.get("titlePrompt");
        const language = formData.get("language");
        const allBlocks = formData.get("allBlocks") === "on";
        
        const containers = allBlocks ? this._sectionStore.sections : [section];

        for (const container of containers) {
            if (container.classList.contains("no-unique")) {
                continue;
            }

            this._textNodesStore.init(container);
            
            if (Object.keys(this._textNodesStore.textNodes).length) {
                this._textNodesStore.textNodes = await this._promptStore.unify(this._textNodesStore.textNodes, prompt, language);
            }

            if (Object.keys(this._textNodesStore.titleNodes).length) {
                this._textNodesStore.titleNodes = await this._promptStore.unify(
                    this._textNodesStore.titleNodes, titlePrompt || prompt, language
                );
            }

            if (Object.keys(this._textNodesStore.altNodes).length) {
                this._textNodesStore.altNodes = await this._promptStore.unify(this._textNodesStore.altNodes, prompt, language);
            }
        }
    }
}