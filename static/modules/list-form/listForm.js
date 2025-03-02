import ElementConverter from "../element-list/elementConverter.js";
import ElementList from "../element-list/elementList.js";

/**
 * Module for management site's cards in page
 */
export default class ListForm {
    __container;

    __API;
    __elementList;

    __removeBtnClass;

    /**
     * @param {HTMLDivElement} container card's container
     * @param {{ getAll: () => Promise<ElementObject>, remove: (id: string | number) => Promise<void> }} API API module
     * @param {ElementConverter} converter converter module
     */
    constructor(container, API, converter = new ElementConverter(), removeBtnClass = "remove-button") {
        this.__container = container;
        this.__API = API;
        this.__elementList = new ElementList(this.__container, converter);
        this.__removeBtnClass = removeBtnClass;
    }

    /**
     * Draw all elements from API
     */
    async getAll() {
        const objects = await this.__API.getAll();

        this.__elementList.draw(objects);
    }

    async removeHandler() {
        this.__container.addEventListener("click", async (e) => {
            const target = e.target;

            if (!target.classList.contains(this.__removeBtnClass)) {
                return;
            }

            e.preventDefault();

            const id = target.dataset.id;
            
            await this.__API.remove(id);
            await this.getAll();
        });
    }

    /**
     * Append one element from API in page
     * @param {ElementObject} object 
     */
    append(object) {
        this.__elementList.drawOne(object);
    }

    async __removeHandler(id) {
        await this.__API.remove(id);
    }
}