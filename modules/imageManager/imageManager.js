import fs from "fs/promises";
import * as crypto from "crypto";
import DOM from "../DOM/DOM.js";

export default class ImageManager {
    async writeImage(directory, extension, buffer) {
        const filename = crypto.randomBytes(20).toString("hex") + extension;

        try {
            await fs.access(directory);
        } catch (error) {
            await fs.mkdir(directory);
        }

        await fs.writeFile(directory + filename, buffer, { recursive: true });

        return filename;
    }

    async removeUnusableImages(directory) {
        const dirname = "overlay-images/";
        const dirPath = directory + dirname;

        try {
            await fs.access(directory);
        } catch (error) {
            return;
        }

        const htmlPath = directory + "index.html";
        const htmlFile = await fs.readFile(htmlPath);

        const dom = new DOM();

        const imagesPath = dom.getAllImgPaths(htmlFile).reduce((acc, value) => {
            if (value.includes(dirname)) {
                acc.push(value);
            }

            return acc;
        }, []);
        const images = await fs.readdir(dirPath);

        for (let i = 0; i < images.length; i++) {
            const element = dirname + images[i];
            
            if (imagesPath.indexOf(element) === -1) {
                await fs.rm(directory + element);
            }
        }
    }
}