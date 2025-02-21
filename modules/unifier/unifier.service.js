import fs from "fs/promises";
import path from "path";
import UnifierFile from "./unifier.file.js";
import DOM from "../DOM/DOM.js";
import UnifierClasses from "./unifier.classes.js";

class UnifierService {
    /**
     * Unify classes of html and css files
     * @param {string} dir Site's directory path
     * @returns {Promise<void>}
     */
    async unifyText(dir) {
        const htmlFiles = await this.__getFiles(dir, "html");
        const cssFiles = await this.__getFiles(dir, "css");

        const classes = this.__getClasses(htmlFiles);

        const files = [...htmlFiles, ...cssFiles];

        for (const file of files) {
            file.unify(classes);
            await file.save();
        }
    }

    async __getFiles(dir, extension) {
        const files = await fs.readdir(dir);
        const htmlFiles = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const fileStat = await fs.stat(filePath);

            if ((fileStat.isFile() && path.extname(file) === "." + extension) || fileStat.isDirectory()) {
                htmlFiles.push(filePath);
            }
        }

        const result = [];

        for (const file of htmlFiles) {
            const fileStat = await fs.stat(file);

            if (fileStat.isFile()) {
                const buffer = await fs.readFile(file, { encoding: "utf8" });

                result.push(new UnifierFile(file, buffer, extension));
            } else {
                const subDirectoryResult = await this.__getFiles(file, extension);

                result.push(...subDirectoryResult);
            }
        }

        return result;
    }

    __getClasses(htmlFiles) {
        const classes = new Set();

        for (const file of htmlFiles) {
            const fileClasses = DOM.getClasses(file.buffer);

            fileClasses.forEach((value) => classes.add(value));
        }

        const classesArray = [];

        classes.forEach((value) => classesArray.push(value));

        return new UnifierClasses(classesArray);
    }
}

export default new UnifierService();
