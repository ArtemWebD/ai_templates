import EventBus from "../../modules/event-bus/eventBus.js";
import ModalComponent from "../modal/modalComponent.js";

export default class PromptFormSubscriber {
    _promptFormComponent;
    _modalComponent;

    constructor(promptFormComponent) {
        this._promptFormComponent = promptFormComponent;
        this._modalComponent = new ModalComponent("dfg", "Уникализация", this._promptFormComponent.outerHTML);

        this.init();
    }

    init() {
        let section;

        EventBus.subscribe("section:contextmenu", (data) => {
            section = data.section;
        });

        EventBus.subscribe("contextmenu:prompt", () => {
            this._modalComponent.open();
            this._promptFormComponent.init(section);
        });
    }
}