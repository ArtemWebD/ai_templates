import FormHandler from "../../../modules/form-handler/formHandler.js"

export default class JsonFormHandler extends FormHandler {
    __id;

    /**
     * 
     * @param {HTMLFormElement} form
     * @param {{ updateJson: (data: any) => Promise<ElementObject> }} API
     */
    constructor(form, API, callback = () => {}) {
        super(form, API, false, callback);
    }

    /**
     * @param {number} id
     */
    set setId(id) {
        this.__id = id;
    }

    async __formHandler() {
        const data = this.__getDataFromForm();
        const object = await this.__API.updateJson(data);

        if (this.__callback) {
            await this.__callback(object);
        }
    }

    __getDataFromForm() {
        const data = super.__getDataFromForm();

        data["id"] = this.__id;

        return data;
    }
}