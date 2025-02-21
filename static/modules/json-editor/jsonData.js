/**
 * Module of white page's json content
 */
export default class JsonData {
    __dataElements = [];

    /**
     * Append new object in json
     * @param {HTMLDivElement} form input group element
     * @param {string} selectors value of selectors key
     * @param {string} prompt user's prompt for selectors
     * @returns {void}
     */
    append(form, selectors, prompt) {
        let elements = selectors.split(",").map((value) => Array.from(document.querySelectorAll(value)));
        elements = [].concat(...elements);

        this.__dataElements.push({
            form,
            elements,
            selectors,
            prompt
        });
    }

    /**
     * 
     * @param {HTMLDivElement} element input group element
     * @returns {void}
     */
    deleteByForm(element) {
        this.__dataElements = this.__dataElements.filter((value) => value.form !== element);
    }

    /**
     * 
     * @param {HTMLDivElement} element input group element
     * @param {string} selectors new selectors value
     * @param {string} prompt new prompt value
     * @returns {void}
     */
    updateByForm(element, selectors, prompt) {
        const elements = selectors.split(",").map((value) => document.querySelector(value));

        for (const dataElement of this.__dataElements) {
            if (dataElement.form === element) {
                dataElement.elements = elements;
                dataElement.selectors = selectors;
                dataElement.prompt = prompt;

                break;
            }
        }
    }

    /**
     * 
     * @param {string} selector selector value
     * @returns {HTMLDivElement | null}
     */
    getFormBySelector(selector) {
        const element = document.querySelector(selector);

        for (const dataElement of this.__dataElements) {
            if (dataElement.elements.indexOf(element) !== -1) {
                return dataElement.form;
            }
        }

        return null;
    }

    /**
     * Elements that has specified selectors in form
     * @param {HTMLDivElement} form input group element
     * @returns {HTMLElement[] | null}
     */
    getElementsByForm(form) {
        for (const dataElement of this.__dataElements) {
            if (dataElement.form === form) {
                return dataElement.elements;
            }
        }

        return null;
    }

    /**
     * Stringify data object
     * @returns {string}
     */
    toJson() {
        const jsonObject = this.__dataElements
            .filter((value) => value.selectors.length && value.prompt.length)
            .map((value) => {
                return {
                    selectors: value.selectors.split(","),
                    prompt: value.prompt
                }
            });
        
        return JSON.stringify(jsonObject);
    }
}