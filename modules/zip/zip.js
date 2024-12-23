import path from "path";
import AdmZip from "adm-zip";

class Zip {
    async unzip(file, filePath) {
        try {
            const zip = new AdmZip(file);

            await zip.extractAllToAsync(filePath);
        } catch (error) {
            console.log(error);
        }
    }

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
