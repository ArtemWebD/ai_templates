import EventBus from "../../modules/event-bus/eventBus.js";
import ContextMenuComponent from "./contextMenuComponent.js";

export default class ContextMenuSubscriber {
    _contextMenuComponent;

    /**
     * @param {ContextMenuComponent} contextMenuComponent
     */
    constructor(contextMenuComponent) {
        this._contextMenuComponent = contextMenuComponent;

        this.init()
    }

    init() {
        this._contextMenuComponent.init();

        let section;
        
        EventBus.subscribe("section:contextmenu", (data) => {
            section = data.section;

            this._contextMenuComponent.setSwitchElement(section);
            this._contextMenuComponent.show(data.event.clientX, data.event.clientY);
        });

        EventBus.subscribe("contextmenu:remove", () => this._contextMenuComponent.removeSection(section));
        EventBus.subscribe("contextmenu:switch", () => this._contextMenuComponent.toggleUniqualization(section));
    }
}