export default class LoaderComponent {
    _container;

    show() {
        if (this._container) {
            this.hide();
        }

        this.render();
    }

    hide() {
        if (!this._container) {
            return;
        }

        this._container.remove();
        this._container = undefined;
    }

    render() {
        const container = document.createElement("div");

        container.classList.add("overlay-loader", "overlay-element");

        container.innerHTML = `
            <span class="overlay-loader__element"></span>
        `;

        document.body.append(container);

        this._container = container;
    }
}