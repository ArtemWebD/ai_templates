import Alert from "../alert/alert.js"

/**
 * Module for copy element content by click
 */
export default class CopyElement {
    __elementClass = "copy-element";
    __alert = new Alert();

    constructor() {
        this.__handler();
    }

    __handler() {
        document.body.addEventListener("click", async (e) => {
            const target = e.target;

            if (!target.classList.contains(this.__elementClass)) {
                return;
            }

            e.preventDefault();
            
            await navigator.clipboard.writeText(target.value || target.dataset?.value || target.textContent);

            this.__alert.show("Текст успешно скопирован", "success");
        });
    }
}