/**
 * Module for loader html element
 */
export default class Loader {
    __element;

    show() {
        const container = document.createElement("div");
        container.classList.add("overlay-loader", "overlay-element");

        container.innerHTML = `
            <span class="overlay-loader__element"></span>
        `;

        document.body.append(container);
        this.__element = container;
    }

    hide() {
        if (!this.__element) {
            return;
        }

        this.__element.remove();
    }
}