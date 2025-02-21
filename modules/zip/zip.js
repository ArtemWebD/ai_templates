import path from "path";
import AdmZip from "adm-zip";

/**
 * Module for working with archives
 */
class Zip {
    /**
     * 
     * @param {Buffer} file binary archive
     * @param {string} filePath path fo unzipping
     * @returns {Promise<void>}
     */
    async unzip(file, filePath) {
        try {
            const zip = new AdmZip(file);

            await zip.extractAllToAsync(filePath);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 
     * @param {string} folderPath Directory path for zipping
     * @param {string} title archive's title
     * @returns {Promise<void>}
     */
    async zip(folderPath, title) {
        try {
            const zip = new AdmZip();
            const readyPath = path.resolve() + "/static/ready/" + title + ".zip";

            await zip.addLocalFolder(folderPath);
            zip.writeZip(readyPath);
        } catch (error) {
            console.log(error);
        }
    }
}

export default new Zip();
