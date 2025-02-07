import { GeneratedWhitePageModel, WhitePageModel } from "../../database.js";
import GeneratedWhitePageStatus from "./generatedWhitePage.status.js";
import GeneratedWhitePageDto from "../../dto/generatedWhitePage.dto.js";
import { literal, Op } from "sequelize";

class GeneratedWhitePageService {
    async create(title, whitePageId, userId, jobId) {
        const generatedWhitePage = await GeneratedWhitePageModel.create({
            title, whitePageId, userId, jobId, status: GeneratedWhitePageStatus.waiting
        });

        return generatedWhitePage.id;
    }

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

    async getByJobId(job) {
        const jobId = job.id;
        
        return GeneratedWhitePageModel.findOne({ where: { jobId } });
    }

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

    async remove(id) {
        await GeneratedWhitePageModel.destroy({ where: { id } });
    }

    async onActive(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.active }, { where: { jobId } });
    }

    async onCompleted(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.completed }, { where: { jobId } });
    }

    async onError(job) {
        const jobId = job.id;
        
        await GeneratedWhitePageModel.update({ status: GeneratedWhitePageStatus.error }, { where: { jobId } });
    }
}

export default new GeneratedWhitePageService();
