import fs from "fs/promises";
import DOM from "../DOM/DOM.js";

export default class UnifierFile {
    path;
    buffer;
    filetype;

    /**
     * 
     * @param {string} path path to file on the disk
     * @param {string} buffer text content of file
     * @param {"html" | "css"} filetype html or css file
     */
    constructor(path, buffer, filetype) {
        this.path = path;
        this.buffer = buffer;
        this.filetype = filetype;
    }

    /**
     * Unify classes of file's text content
     * @param {UnifierClasses} classes Instance of UnifierClasses class
     * @returns {void}
     */
    unify(classes) {
        if (this.filetype === "html") {
            this.__unifyHtml(classes);
        }

        this.__unifyCss(classes);
    }

    /**
     * Write file on the disk
     * @returns {Promise<void>}
     */
    async save() {
        await fs.writeFile(this.path, this.buffer);
    }

    __unifyHtml(classes) {
        Object.keys(classes.classes).forEach((value) => {
            this.buffer = DOM.changeClasses(this.buffer, value, classes.classes[value]);
        });
    }

    __unifyCss(classes) {
        Object.keys(classes.classes).forEach((value) => {
            const separator = new RegExp(
                `[.]${value}(?![-_])(?![a-z])(?![A-Z])`,
                'g',
            );
            
            this.buffer = this.buffer.replaceAll(separator, `.${classes.classes[value]}`);
        });
    }
}
