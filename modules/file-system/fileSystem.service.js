import fs from "fs/promises";
import path from "path";

/**
 * Class for file management
 */
export default class FileSystemService {
    /**
     * @param {string} directory directory for searching
     * @param {string} extension file's extension in format .extname
     * @returns {Promise<string[]>} relative paths of files
     */
    static async getFilesByExtension(directory, extension, baseDirectory = "") {
        const files = await fs.readdir(directory);
        const result = [];

        for (const file of files) {
            const filePath = path.join(directory, file);
            const fileStat = await fs.stat(filePath);

            if (fileStat.isDirectory()) {
                const nestedResult = await this.getFilesByExtension(filePath, extension, path.join(directory));

                result.push(...nestedResult);
            }

            if (fileStat.isFile() && path.extname(file) === extension) {
                result.push(
                    filePath
                        .replace(baseDirectory.length ? baseDirectory : path.join(directory), "")
                        .replaceAll("\\", "/")
                );
            }
        }

        return result;
    }
}