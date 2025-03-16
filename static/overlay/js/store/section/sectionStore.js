import EventBus from "../../modules/event-bus/eventBus.js";

export default class SectionStore {
    _sections = [];

    get sections() {
        return this._sections;
    }
    
    set push(section) {
        this._sections.push(section);

        EventBus.publish("section:update", section);
        
        section.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            EventBus.publish("section:contextmenu", { event: e, section })
        });
    }

    init() {
        this._sections = [];
        document.querySelectorAll("section").forEach((section) => this.push = section);
    }

    remove(section) {
        for (let i = 0; i < this._sections.length; i++) {
            const value = this._sections[i];

            if (value.isEqualNode(section)) {
                this._sections.splice(i, 1);

                EventBus.publish("section:remove", section);
                value.remove();

                break;
            }
        }
    }
}