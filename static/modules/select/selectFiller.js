import OptionConverter from "./optionConverter.js";

/**
 * Module for filling select element
 */
export default class SelectFiller {
    __element;

    __optionConverter = new OptionConverter();

    /**
     * @param {HTMLSelectElement} element 
     */
    constructor(element) {
        this.__element = element;
    }

    /**
     * Fill select element
     * @param {{value: string, text: string}[]} data 
     */
    fill(data) {
        data.forEach((value) => {
            const option = this.__optionConverter.convert(value);

            this.__element.append(option);
        });
    }
}