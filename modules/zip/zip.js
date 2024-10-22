import path from "path";
import AdmZip from "adm-zip";

export default class Zip {
    async unzip(file, title) {
        try {
            const zip = new AdmZip(file);
            const templatePath = path.resolve() + "/static/templates/" + title;

            await zip.extractAllToAsync(templatePath);
        } catch (error) {
            console.log(error);
        }
    }

    async zip(title) {
        try {
            const zip = new AdmZip();
            const templatePath = path.resolve() + "/static/templates/" + title;
            const readyPath = path.resolve() + "/static/ready/" + title + ".zip";

            await zip.addLocalFolder(templatePath);
            zip.writeZip(readyPath);
        } catch (error) {
            console.log(error);
        }
    }
}