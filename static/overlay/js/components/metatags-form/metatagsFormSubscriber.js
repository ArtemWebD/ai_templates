import EventBus from "../../modules/event-bus/eventBus.js";
import ModalComponent from "../modal/modalComponent.js";

export default class MetatagsFormSubscriber {
    _metatagsFormComponent;
    _modalComponent;

    /**
     * @param {MetatagsFormComponent} metatagsFormComponent
     */
    constructor(metatagsFormComponent) {
        this._metatagsFormComponent = metatagsFormComponent;
        this._modalComponent = new ModalComponent("fddf", "Изменить метатэги", this._metatagsFormComponent.outerHTML);

        this.init();
    }

    init() {
        EventBus.subscribe("contextmenu:metatags", () => {
            this._modalComponent.open();
            this._metatagsFormComponent.init();

            EventBus.subscribe("metatags:update", ({ title, description, keywords }) => {
                if (title) {
                    this._metatagsFormComponent.title = title;
                }
    
                if (description) {
                    this._metatagsFormComponent.description = description;
                }
    
                if (keywords) {
                    this._metatagsFormComponent.keywords = keywords;
                }
            });
        });
    }
}