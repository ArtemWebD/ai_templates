import fs from "fs/promises";
import * as crypto from "crypto";
import DOM from "../DOM/DOM.js";

/**
 * Module for image management
 */
class ImageManager {
    /**
     * Write image from binary data to directory
     * @param {string} directory full path to image's directory
     * @param {string} extension image's file extension
     * @param {Buffer} buffer binary file
     * @returns {Promise<string>} image's filename
     */
    async writeImage(directory, extension, buffer) {
        const filename = crypto.randomBytes(20).toString("hex") + extension;

        try {
            await fs.access(directory);
        } catch (error) {
            await fs.mkdir(directory, { recursive: true });
        }

        await fs.writeFile(directory + filename, buffer, { recursive: true });

        return filename;
    }

    /**
     * Remove images that are not used in the html
     * @param {string} directory full path to image's directory
     * @returns {Promise<void>} 
     */
    async removeUnusableImages(directory) {
        const dirname = "overlay-images/";
        const dirPath = directory + dirname;

        let images = [];

        try {
            await fs.access(directory);
            images = await fs.readdir(dirPath);
        } catch (error) {
        }

        const htmlPath = directory + "index.html";
        const htmlFile = await fs.readFile(htmlPath);

        const imagesPath = DOM.getAllImgPaths(htmlFile).reduce((acc, value) => {
            if (value.includes(dirname)) {
                acc.push(value);
            }

            return acc;
        }, []);

        for (let i = 0; i < images.length; i++) {
            const element = dirname + images[i];
            
            if (imagesPath.indexOf(element) === -1) {
                await fs.rm(directory + element);
            }
        }
    }
}

export default new ImageManager();
