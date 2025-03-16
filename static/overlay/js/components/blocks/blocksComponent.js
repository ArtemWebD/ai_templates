import EventBus from "../../modules/event-bus/eventBus.js";
import store from "../../store/store.js";

export default class BlocksComponent {
    _blocks = [];

    _sectionStore = store.sectionStore;

    set push(block) {
        this._blocks.push(block);
    }

    /**
     * @param {HTMLElement} section 
     */
    addBlocks() {
        this._sectionStore.sections.forEach((section) => {
            const block = this.render(section);

            block.onclick = () => EventBus.publish("block:paste", block);

            this.push = block;
        });
    }

    /**
     * @param {HTMLElement} section 
     */
    removeBlocks() {
        this._blocks.forEach((block) => block.remove());

        this._blocks = [];
    }

    paste(block, section) {
        block.after(section);
        this._sectionStore.push = section;
    }

    render(section) {
        const overlayBlock = document.createElement("div")

        overlayBlock.classList.add("overlay-block", "overlay-element");

        overlayBlock.innerHTML = "<span>Вставить блок здесь</span>";

        section.after(overlayBlock);

        return overlayBlock;
    }
}