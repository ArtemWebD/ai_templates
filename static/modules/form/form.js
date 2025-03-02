/**
 * Module for handing form
 */
export default class Form {
    __form;

    /**
     * @param {HTMLFormElement} form html form element
     */
    constructor(form) {
        this.__form = form;
    }

    /**
     * @returns {HTMLFormElement}
     */
    get getForm() {
        return this.__form;
    }

    /**
     * Clear form's inputs
     */
    reset() {
        this.__form.reset();
    }

    /**
     * Handle sumbit event
     * @param {() => Promise<void> | void} callback submit handler
     */
    submitHandle(callback) {
        this.__form.onsubmit = async (e) => {
            e.preventDefault();

            await callback();

            this.reset();
        }
    }
}