import { GeneratedWhitePageModel, WhitePageModel } from "../../database.js";
import GeneratedWhitePageStatus from "./generatedWhitePage.status.js";
import GeneratedWhitePageDto from "../../dto/generatedWhitePage.dto.js";
import { literal, Op } from "sequelize";

class GeneratedWhitePageService {
    /**
     * 
     * @param {string} title title of generated white page
     * @param {number} whitePageId template's id
     * @param {number} userId user's id
     * @param {number} jobId bull job's id
     * @returns {Promise<number>} id of new record
     */
    async create(title, whitePageId, userId, jobId) {
        const generatedWhitePage = await GeneratedWhitePageModel.create({
            title, whitePageId, userId, jobId, status: GeneratedWhitePageStatus.waiting
        });

        return generatedWhitePage.id;
    }

    /**
     * 
     * @param {number} userId user's id
     * @returns {Promise<GeneratedWhitePageDto[]>} found records
     */
    async getAllByUser(userId) {
        const models = await GeneratedWhitePageModel.findAll({ 
            where: { userId },
            include: [{
                model: WhitePageModel,
                as: "whitePage",
                attributes: ["title"],
            }],
        });

        return models.map((value) => new GeneratedWhitePageDto(value));
    }

    /**
     * 
     * @param {import("bull").Job} job bull's job
     * @returns {Promise<GeneratedWhitePageModel>} database's record
     */
    async getByJobId(job) {
        const jobId = job.id;
        
        return GeneratedWhitePageModel.findOne({ where: { jobId } });
    }

    /**
     * 
     * @param {number} minutesInterval record's lifetime in minutes
     * @returns {Promise<GeneratedWhitePageDto[]>} found records
     */
    async getByTime(minutesInterval) {
        if (typeof minutesInterval !== "number") {
            throw new Error("Interval must be a number");
        }

        const models = await GeneratedWhitePageModel.findAll({
            where: {
                createdAt: {
                    [Op.lt]: literal(`NOW() - INTERVAL '${minutesInterval} minutes'`)
                }
            }
        });

        return models.map((value) => new GeneratedWhitePageDto(value));
    }

    /**
     * 
     * @param {number} id record's id
     * @returns {Promise<void>}
     */
    async remove(id) {
        await GeneratedWhitePageModel.destroy({ where: { id } });
    }

    /**
     * 
     * @param {import("bull").Job} job bull's job
     * @returns {Promise<void>}
     */
    async onActive(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.active }, { where: { jobId } });
    }

    /**
     * 
     * @param {import("bull").Job} job bull's job
     * @returns {Promise<void>}
     */
    async onCompleted(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.completed }, { where: { jobId } });
    }

    /**
     * 
     * @param {import("bull").Job} job bull's job
     * @returns {Promise<void>}
     */
    async onError(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.error }, { where: { jobId } });
    }
}

export default new GeneratedWhitePageService();
