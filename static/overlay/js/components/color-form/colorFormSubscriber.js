import ModalComponent from "../modal/modalComponent.js";
import EventBus from "../../modules/event-bus/eventBus.js";

export default class ColorFormSubscriber {
    _colorFormComponent;
    _modalComponent;

    /**
     * @param {ColorFormComponent} colorFormComponent
     */
    constructor(colorFormComponent) {
        this._colorFormComponent = colorFormComponent;
        this._modalComponent = new ModalComponent("asd", "Выбрать цвет", this._colorFormComponent.outerHTML);

        this.init();
    }

    init() {
        let section;

        EventBus.subscribe("section:contextmenu", (data) => {
            section = data.section;
        });

        EventBus.subscribe("contextmenu:color", () => {
            this._modalComponent.open();
            this._colorFormComponent.init(section);
        });
    }
}