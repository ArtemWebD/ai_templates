/**
 * Module for filling select element
 */
export default class TextInputFiller {
    __element;

    /**
     * @param {HTMLSelectElement} element 
     */
    constructor(element) {
        this.__element = element;
    }

    /**
     * Fill select element
     * @param {string} data 
     */
    fill(data) {
        this.__element.value = data;
    }
}