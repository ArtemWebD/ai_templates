import EventBus from "../../modules/event-bus/eventBus.js";
import store from "../../store/store.js";

export default class ImageFormComponent {
    _id = "overlayUploadImage";

    _container;
    _image;

    _imageStore = store.imageStore;

    get outerHTML() {
        return `
            <form id="${this._id}">
                <input type="file" name="image" accept="image/*" />
                <button class="overlay-button">Загрузить</button>
            </form>
        `;
    }

    /**
     * @param {HTMLImageElement} img
     */
    set image(img) {
        this._image = img;
    }

    init() {
        this.render();

        this._container.onsubmit = async (e) => {
            e.preventDefault();

            await this._upload(e.target);

            e.target.reset();
            EventBus.publish("uploadImage:end");
        }
    }

    render() {
        const container = document.getElementById(this._id);

        this._container = container ? container : this._container;
    }

    /**
     * @param {HTMLFormElement} form 
     */
    async _upload(form) {
        const formData = new FormData(form);

        const id = new URLSearchParams(window.location.search).get("id");

        formData.append("id", id);

        await this._imageStore.upload(formData, this._image);
    }
}