import EventBus from "../../modules/event-bus/eventBus.js";
import ModalComponent from "../modal/modalComponent.js";

export default class ImageFormSubscriber {
    _imageFormComponent;
    _modalComponent;

    /**
     * @param {ImageFormComponent} imageFormComponent
     */
    constructor(imageFormComponent) {
        this._imageFormComponent = imageFormComponent;
        this._modalComponent = new ModalComponent("asd", "Загрузить изображение", this._imageFormComponent.outerHTML);

        this.init();
    }

    init() {
        EventBus.subscribe("image:click", (image) => {
            this._modalComponent.open();
            this._imageFormComponent.init();

            this._imageFormComponent.image = image;
        });

        EventBus.subscribe("uploadImage:end", () => this._modalComponent.close());
    }
}