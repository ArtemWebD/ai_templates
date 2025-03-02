/**
 * Module for convert string data to option element
 */
export default class OptionConverter {
    /**
     * @param {{value: string, text: string}} data 
     * @returns {HTMLOptionElement}
     */
    convert(data) {
        const container = document.createElement("option");

        container.value = data.value;
        container.innerHTML = data.text;

        return container;
    }
}