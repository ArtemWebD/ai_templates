import Alert from "../alert/alert.js";
import Form from "../form/form.js";
import InputList from "../form/inputList.js";
import InputValidator from "../form/inputValidator.js";

/**
 * Module for handle forms
 */
export default class FormHandler {
    __formElement;

    __form;
    __API;

    __isFormData;
    __callback;

    /**
     * 
     * @param {HTMLFormElement} form
     * @param {{ create: (data: any) => Promise<ElementObject> }} API 
     * @param {boolean} isFormData
     * @param {(object: ElementObject) => Promise<void> | void} callback
     */
    constructor(form, API, isFormData = false, callback = undefined) {
        this.__API = API;
        this.__formElement = form;
        this.__form = new Form(this.__formElement);
        this.__isFormData = isFormData;
        this.__callback = callback;

        this.__form.submitHandle(() => this.__formHandler());
    }

    async __formHandler() {
        const data = this.__getDataFromForm();
        const object = await this.__API.create(data);

        if (this.__callback) {
            await this.__callback(object);
        }
    }

    __getDataFromForm() {
        const inputList = new InputList(this.__formElement);
        const formData = new FormData();
        const data = inputList.getInputsData(formData);

        data.forEach((inputData) => {
            const validator = new InputValidator();

            if (!validator.validate(inputData)) {
                const alert = new Alert();

                alert.show("Неверно введены данные", "danger");
                throw new Error("Incorrect data");
            }
        });

        if (this.__isFormData) {
            return formData;
        }

        return data.reduce((acc, inputData) => {
            acc[inputData.name] = inputData.value;

            return acc;
        }, {});
    }
}