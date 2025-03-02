import FormHandler from "../../../modules/form-handler/formHandler.js";

export default class GenerateTokenFormHandler extends FormHandler {
    __id;

    /**
     * 
     * @param {HTMLFormElement} form
     * @param {{ create: (data: any) => Promise<ElementObject> }} API
     */
    constructor(form, API) {
        super(form, API);
    }

    /**
     * @param {number} id
     */
    set setId(id) {
        this.__id = id;
    }

    __getDataFromForm() {
        const data = super.__getDataFromForm();

        data["userId"] = this.__id;

        return data;
    }
}