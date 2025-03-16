export default class ModalComponent {
    _container;

    _title;
    _body;
    _id;

    constructor(id, title, body) {
        this._id = id;
        this._title = title;
        this._body = body;
    }

    open() {
        this.render();

        document.body.style.overflow = "hidden";

        this._container.onclick = (e) => {
            if (e.target.classList.contains("overlay-modal")) {
                this.close();
            }
        }
    }

    close() {
        this._container.remove();

        this._container = undefined;
        document.body.style.overflow = "";
    }

    render() {
        const container = document.createElement("div");

        container.classList.add("overlay-modal", "overlay-element");
        container.innerHTML = `
            <div class="overlay-modal__dialog">
                <div class="overlay-modal__title">
                    <h4>${this._title}</h4>
                </div>
                <div class="overlay-modal__body">
                    ${this._body}
                </div>
            </div>
        `;

        document.body.append(container);

        this._container = container;
    }
}