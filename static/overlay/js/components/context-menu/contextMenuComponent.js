import EventBus from "../../modules/event-bus/eventBus.js";
import store from "../../store/store.js";

export default class ContextMenuComponent {
    _sectionStore = store.sectionStore;

    _container;

    /**
     * @param {boolean} value
     */
    set isShow(value) {
        this._isShow = value;
    }

    /**
     * @param {number} x position of cursor
     * @param {number} y position of cursor
     */
    show(x, y) {
        this._container.setAttribute("style", `left: ${x}px; top: ${y}px`);
        this._container.classList.add("overlay-popup_active");
    }

    hide() {
        this._container.classList.remove("overlay-popup_active");
    }

    init() {
        this._container = this.render();

        this._container.querySelectorAll("li").forEach((el) => {
            el.onclick = () => {
                const target = el.dataset.target;
                
                EventBus.publish(`contextmenu:${target}`);
                this.hide();
            }
        });

        this._container.onmouseleave = () => this.hide();
    }

    setSwitchElement(section) {
        const element = this._container.querySelector(".overlay-popup__switch");

        if (!element) {
            return;
        }

        element.innerHTML = section.classList.contains("no-unique") ? "Включить уникализацию" : "Отключить уникализацию";
    }

    removeSection(section) {
        this._sectionStore.remove(section);
    }

    toggleUniqualization(section) {
        section.classList.toggle("no-unique");
        this.setSwitchElement(section); 
    }

    render() {
        const container = document.createElement("div");

        container.classList.add("overlay-popup", "overlay-element");
        
        container.innerHTML = `<ul>
                <li data-target="cut">Вырезать блок</li>
                <li data-target="remove">Удалить блок</li>
                <li data-target="color">Цвета блока</li>
                <li data-target="prompt">Настройка блока</li>
                <li data-target="metatags">Сменить мета тэги</li>
                <li class="overlay-popup__switch" data-target="switch"></li>
            </ul>`;
        
        document.body.append(container);

        return container;
    }
}