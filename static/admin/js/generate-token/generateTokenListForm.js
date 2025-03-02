import ListForm from "../../../modules/list-form/listForm.js";

export default class GenerateTokenListForm extends ListForm {
    constructor(container, API, converter = new ElementConverter(), removeBtnClass = "remove-button") {
        super(container, API, converter, removeBtnClass);
    }

    /**
     * @param {number} id user's id
     */
    async getAll(id) {
        const objects = await this.__API.getAll(id);

        this.__elementList.draw(objects);
    }
}