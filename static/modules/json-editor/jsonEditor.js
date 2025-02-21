import WhitePage from "../white-page/white-page.js";
import JsonData from "./jsonData.js";

/**
 * Json editor form handler
 */
export default class JsonEditor {
    __form;
    __id;
    __sidebar;

    __dataElements = new JsonData();
    __whitePage = new WhitePage();

    /**
     * 
     * @param {Sidebar} sidebar 
     */
    constructor(sidebar) {
        this.__sidebar = sidebar;
        this.__form = document.getElementById("json-form");

        if (!this.__form) {
            throw new Error("Form element was not found");
        }

        this.__getId();
        this.__setJsonData();
        
        this.__pageClickHandler();
        this.__saveHandler();
    }

    /**
     * Get id of template
     */
    __getId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.__id = urlParams.get("id");

        if (!this.__id) {
            throw new Error("Template's id was not found");
        }
    }

    /**
     * Get json of specified white page
     */
    async __setJsonData() {
        const json = await this.__whitePage.getJson(this.__id);
        const jsonObject = JSON.parse(json);

        jsonObject.forEach((object) => {
            this.__appendInputGroup(object.selectors.toString(), object.prompt);
        });
    }

    /**
     * Append input group in form with specified data
     * @param {string | undefined} selectors selectors value
     * @param {string | undefined} prompt prompt value
     */
    __appendInputGroup(selectors = "", prompt = "") {
        const container = document.createElement("div");

        container.classList.add("overlay-sidebar__input", "overlay-sidebar__input_flex");
        container.tabIndex = 0;
        container.innerHTML = `
            <textarea class="overlay-input" name="selectors">${selectors}</textarea>
            <textarea class="overlay-input" name="prompt">${prompt}</textarea>
            <div class="overlay-sidebar__input__close overlay-close-element"></div>
        `;

        this.__form.append(container);

        this.__dataElements.append(container, selectors, prompt);

        this.__removeHandler();
        this.__updateHandler();
    }

    /**
     * Handle input groups remove button
     */
    __removeHandler() {
        const elements = this.__form.querySelectorAll(".overlay-sidebar__input__close");

        elements.forEach((el) => {
            el.onclick = () => {
                this.__dataElements.deleteByForm(el.parentElement);
                el.parentElement.remove();
            }
        });
    }

    /**
     * Handle clicks on elements to save selectors
     */
    __pageClickHandler() {
        document.onclick = (e) => {
            e.preventDefault();

            const sidebarEl = document.querySelector(".overlay-sidebar");

            if (e.target.children.length > 0 || sidebarEl.contains(e.target) || e.target === sidebarEl) {
                return;
            }

            this.__sidebar.open();

            const selector = this.__generateSelector(e.target);
            const element = this.__dataElements.getFormBySelector(selector);

            if (element) {
                element.focus();
                return;
            }

            this.__appendInputGroup(selector);
        }
    }

    /**
     * Update json data by inputs and set focus on selected elements
     */
    __updateHandler() {
        const forms = this.__form.querySelectorAll(".overlay-sidebar__input");

        forms.forEach((form) => {
            const selectorsInput = form.querySelector('textarea[name="selectors"]');
            const promptInput = form.querySelector('textarea[name="prompt"]');

            const elements = this.__dataElements.getElementsByForm(form);

            const onblurEventHandler = () => {
                elements.forEach((el) => {
                    el.classList.remove("json-selected");
                });

                const selectors = selectorsInput.value;
                const prompt = promptInput.value;

                this.__dataElements.updateByForm(form, selectors, prompt);
            }

            const onfocusEventHandler = () => {
                elements.forEach((el) => {
                    el.classList.add("json-selected");
                });
            }

            form.onfocus = () => onfocusEventHandler();
            form.onblur = () => onblurEventHandler();

            selectorsInput.onfocus = () => onfocusEventHandler();
            selectorsInput.onblur = () => onblurEventHandler();
            
            promptInput.onfocus = () => onfocusEventHandler();
            promptInput.onblur = () => onblurEventHandler();
        });
    }

    /**
     * Save changes handler
     */
    __saveHandler() {
        const button = document.querySelector(".overlay-sidebar__save");

        button.onclick = async () => {
            const json = this.__dataElements.toJson();

            await this.__whitePage.updateJson(this.__id, json);
        }
    }

    /**
     * Get full selector of element
     * @param {HTMLElement} el 
     * @returns {string | null}
     */
    __generateSelector(el) {
        if (!el) {
            return null;
        }

        if (el.tagName === 'HTML') {
            return 'HTML';
        }
        
        let selector = '';
        
        if (el.id) {
            selector = '#' + el.id;
            return selector; // ID достаточно, возвращаем
        }
        
        let parent = el.parentNode;

        if (!parent) {
            return el.tagName.toLowerCase(); // Корневой элемент
        }
        
        let index = 1;
        let sibling = el.previousElementSibling;

        while (sibling) {
            if (sibling.tagName === el.tagName) {
              index++;
            }
            sibling = sibling.previousElementSibling;
        }
        
        selector = this.__generateSelector(parent) + ' > ' + el.tagName.toLowerCase() + ':nth-of-type(' + index + ')';
        
        return selector;
    }
}