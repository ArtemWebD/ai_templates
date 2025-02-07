export default class JsonData {
    __dataElements = [];

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

    deleteByForm(element) {
        this.__dataElements = this.__dataElements.filter((value) => value.form !== element);
    }

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

    getFormBySelector(selector) {
        const element = document.querySelector(selector);

        for (const dataElement of this.__dataElements) {
            if (dataElement.elements.indexOf(element) !== -1) {
                return dataElement.form;
            }
        }
    }

    getElementsByForm(form) {
        for (const dataElement of this.__dataElements) {
            if (dataElement.form === form) {
                return dataElement.elements;
            }
        }
    }

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