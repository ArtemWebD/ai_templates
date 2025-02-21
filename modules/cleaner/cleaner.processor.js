import path from "path";
import fs from "fs/promises";
import generatedWhitePageService from "../generatedWhitePage/generatedWhitePage.service.js";

/**
 * Cleaning module
 */
class CleanerProcessor {
    /**
     * Clean directories
     * @param {import("bull").Job} job bull's job object
     * @param {import("bull").DoneCallback} done bull's done function
     * @returns {Promise<void>}
     */
    async clean(job, done) {
        try {
            const lifetime = job.data.lifetime;
            const dirPath = path.resolve() + job.data.path;

            const files = await fs.readdir(dirPath);

            if (!files.length) {
                done();
                return;
            }

            for (const fileName of files) {
                const filePath = path.join(dirPath, fileName);
                const stat = await fs.stat(filePath);

                //File creation time in ms
                const now = new Date();
                const fileCreationTime = now - stat.birthtime;

                if (fileCreationTime >= lifetime) {
                    await fs.rm(filePath, { recursive: true });
                }
            }

            done();
        } catch (error) {
            done(error);
        }
    }

    /**
     * Clean database of temporary records
     * @param {import("bull").Job} job bull's job object
     * @param {import("bull").DoneCallback} done bull's done function
     * @returns {Promise<void>}
     */
    async cleanDatabase(job, done) {
        try {
            const lifetime = job.data.lifetime;
            const models = await generatedWhitePageService.getByTime(lifetime);

            for (const model of models) {
                await generatedWhitePageService.remove(model.id);
            }

            done();
        } catch (error) {
            console.log(error);
            done(error);
        }
    }
}

export default new CleanerProcessor();
