import { GenerateTokenModel } from "../../database.js";
import GenerateTokenDto from "../../dto/generateToken.dto.js";
import jwt from "jsonwebtoken";
import ApiError from "../exceptions/api-error.js";

class GenerateTokenService {
    /**
     * @param {number} userId user's id
     * @param {number} count count of using
     * @returns {Promise<GenerateTokenDto>}
     */
    async create(userId, count) {
        const token = jwt.sign(
            { userId },
            process.env.GENERATE_TOKEN_SECRET,
            { expiresIn: process.env.GENERATE_TOKEN_DAY_LIFETIME + "d" }
        );
        const generateToken = await GenerateTokenModel.create({ token, userId, count });

        return new GenerateTokenDto(generateToken);
    }

    /**
     * @param {string} token user's generate token
     * @param {number} userId user's id
     * @returns {Promise<boolean>}
     */
    async verify(token, userId) {
        const generateToken = await GenerateTokenModel.findOne({ where: { token } });

        if (!generateToken || generateToken.count === 0) {
            return false;
        }

        try {
            const tokenData = await jwt.verify(token, process.env.GENERATE_TOKEN_SECRET);

            return tokenData.userId === userId;
        } catch (error) {
            return false;
        }
    }

    /**
     * Reduce the number of uses by 1
     * @param {string} token user's token
     * @returns {Promise<void>}
     */
    async decreaseCount(token) {
        const generateToken = await GenerateTokenModel.findOne({ where: { token } });

        if (!generateToken) {
            throw ApiError.BadRequest("Указанный токен не валиден");
        }

        generateToken.decrement(["count"], { by: 1 });
    }

    /**
     * Increase the number of uses by specidied count
     * @param {string} token user's token
     * @param {number} count the number by which the number of uses increases
     * @returns {Promise<GenerateTokenDto>}
     */
    async increaseCount(token, count) {
        let generateToken = await GenerateTokenModel.findOne({ where: { token } });

        if (!generateToken) {
            throw ApiError.BadRequest("Указанный токен не валиден");
        }

        generateToken = await generateToken.increment(["count"], { by: count });

        return new GenerateTokenDto(generateToken);
    }

    /**
     * @param {number} userId user's id
     * @returns {Promise<GenerateTokenDto[]>}
     */
    async getByUser(userId) {
        const tokens = await GenerateTokenModel.findAll({ where: { userId } });

        return tokens.map((token) => new GenerateTokenDto(token));
    }
}

export default new GenerateTokenService();