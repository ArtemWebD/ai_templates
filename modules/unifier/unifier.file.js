import fs from "fs/promises";
import DOM from "../DOM/DOM.js";

export default class UnifierFile {
    path;
    buffer;
    filetype;

    /**
     * 
     * @param {*} path path to file on the disk
     * @param {*} buffer text content of file
     * @param {*} filetype html or css file
     */
    constructor(path, buffer, filetype) {
        this.path = path;
        this.buffer = buffer;
        this.filetype = filetype;
    }

    /**
     * Unify classes of file's text content
     * @param {*} classes Instance of UnifierClasses class
     */
    unify(classes) {
        if (this.filetype === "html") {
            this.__unifyHtml(classes);
        }

        this.__unifyCss(classes);
    }

    /**
     * Write file on the disk
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
