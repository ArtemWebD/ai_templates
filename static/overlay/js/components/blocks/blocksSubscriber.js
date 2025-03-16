import EventBus from "../../modules/event-bus/eventBus.js";
import store from "../../store/store.js";

export default class BlocksSubscriber {
    _blocksComponent;
    _sectionStore = store.sectionStore;

    /**
     * @param {BlocksComponent} blocksComponent
     */
    constructor(blocksComponent) {
        this._blocksComponent = blocksComponent;

        this.init();
    }

    init() {
        let section;

        EventBus.subscribe("section:contextmenu", (data) => {
            section = data.section;
        });

        EventBus.subscribe("contextmenu:cut", () => {
            this._sectionStore.remove(section);
            this._blocksComponent.addBlocks();
        });

        EventBus.subscribe("block:paste", (block) => {
            this._blocksComponent.paste(block, section);
            this._blocksComponent.removeBlocks();
        });
    }
}