/**
 * Module for storing input's data
 */
export default class InputData {
    name;
    value;
    type;

    /**
     * @param {string} name input's name
     * @param {any} value input's value
     * @param {"number" | "string" | "files" | "file"} type data's type
     */
    constructor(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = this.__setType(type);
    }

    __setType(type) {
        if (type !== "number" && type !== "string" && type !== "files" && type !== "file") {
            throw new Error("Invalid data type specified");
        }

        return type;
    }
}