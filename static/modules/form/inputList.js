import InputData from "./inputData.js"

/**
 * Module for handling inputs
 */
export default class InputList {
    __inputs = {
        text: [],
        file: [],
        number: []
    };

    /**
     * @param {HTMLFormElement | undefined} form html form element
     */
    constructor(form = undefined) {
        if (form) {
            this.getInputsFromForm(form);
        }
    }

    /**
     * Get input's data of form
     * @param {HTMLFormElement} form html form element
     * @returns {InputData[]}
     */
    getInputsFromForm(form) {
        const textInputs = form.querySelectorAll(
            'input[type="text"], input[type="email"], input[type="password"], '
            + 'input[type="search"], input[type="url"], input[type="tel"], '
            + 'textarea, select'
        );
        const fileInputs = form.querySelectorAll('input[type="file"]');
        const numberInputs = form.querySelectorAll('input[type="number"]');

        textInputs.forEach((input) => {
            if (input.name) {
                this.__inputs.text.push(input)
            }
        });
        
        fileInputs.forEach((input) => {
            if (input.name) {
                this.__inputs.file.push(input)
            }
        });

        numberInputs.forEach((input) => {
            if (input.name) {
                this.__inputs.number.push(input)
            }
        });
    }

    /**
     * Get input's data of form and put it in formData if parameter is passed
     * @param {FormData | undefined} formData instance of FormData class
     * @returns {InputData[]}
     */
    getInputsData(formData) {
        const data = [];

        data.push(
            ...this.getTextInputData(),
            ...this.getNumberInputData(),
            ...this.getFileInputData()
        );

        if (formData) {
            data.forEach((inputData) => formData.append(inputData.name, inputData.value));
        }

        return data;
    }

    /**
     * Get text input's data
     * @returns {InputData[]}
     */
    getTextInputData() {
        return this.__inputs.text.map((input) => new InputData(input.name, input.value, "string"));
    }

    /**
     * Get number input's data
     * @returns {InputData[]}
     */
    getNumberInputData() {
        return this.__inputs.number.map((input) => new InputData(input.name, +input.value, "number"));
    }

    /**
     * Get file input's data and put it in formData if parameter is passed
     * @param {FormData | undefined} formData instance of FormData class
     * @returns {InputData[]}
     */
    getFileInputData(formData) {
        const data = this.__inputs.file.map((input) => {
            if (input.files.length === 1) {
                return new InputData(input.name, input.files[0], "file")
            }
            
            return new InputData(input.name, input.files, "files")     
        });

        if (formData) {
            data.forEach((inputData) => formData.append(inputData.name, inputData.value));
        }

        return data;
    }
}