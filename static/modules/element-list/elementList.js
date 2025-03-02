/**
 * Parent module for management of lists in page
 */
export default class ElementList {
    __container;

    __converter;

    /**
     * @param {HTMLDivElement} container container of list
     * @param {ElementConverter} converter converter of js objects
     */
    constructor(container, converter) {
        this.__container = container;
        this.__converter = converter;
    }

    /**
     * Draw specified objects in html page
     * @param {ElementObject[]} elements objects for drawing
     * @returns {void}
     */
    draw(elements) {
        this.__container.innerHTML = "";
        elements.forEach((element) => this.drawOne(element));
    }

    /**
     * Draw one object in html page
     * @param {ElementObject} element 
     */
    drawOne(element) {
        const htmlElement = this.__converter.convert(element);

        this.__container.append(htmlElement);
    }
}