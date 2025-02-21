/**
 * Class for creating prompt from user's data
 */
export default class Prompt {
    __languageInput;
    __countryInput;
    __companyInput;
    __descriptionInput;
    __promptInput;

    /**
     * 
     * @param {HTMLFormElement} form Form for entering data
     */
    constructor(form) {
        this.__languageInput = form.querySelector('input[name="language"]');
        this.__countryInput = form.querySelector('input[name="country"]');
        this.__companyInput = form.querySelector('input[name="company"]');
        this.__descriptionInput = form.querySelector('input[name="description"]');
        this.__promptInput = form.querySelector('textarea[name="prompt"]');
    }

    /**
     * Get full prompt in text format
     * @returns {string}
     */
    toString() {
        return this.getLanguage() + this.getCountry() + this.getCompany() + this.getDescription() + this.getSitePrompt();
    }

    /**
     * Get language prompt
     * @returns {string}
     */
    getLanguage() {
        const value = this.__languageInput?.value?.trim();

        if (!value) {
            return "";
        }

        return `Язык: ${value}\n`;
    }

    /**
     * Get country prompt
     * @returns {string}
     */
    getCountry() {
        const value = this.__countryInput?.value?.trim();

        if (!value) {
            return "";
        }

        return `Страна: ${value}\n`;
    }

    /**
     * Get company prompt
     * @returns {string}
     */
    getCompany() {
        const value = this.__companyInput?.value?.trim();

        if (!value) {
            return "";
        }

        return `Название компании: ${value}\n`;
    }

    /**
     * Get description prompt
     * @returns {string}
     */
    getDescription() {
        const value = this.__descriptionInput?.value?.trim();

        if (!value) {
            return "";
        }

        return `Описание компании: ${value}\n`;
    }

    /**
     * Get site prompt
     * @returns {string}
     */
    getSitePrompt() {
        const value = this.__promptInput?.value?.trim();

        if (!value) {
            return "";
        }

        return `Описание сайта: ${value}\n`;
    }
}