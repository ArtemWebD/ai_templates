import generateTokenService from "./generateToken.service.js";

class GenerateTokenController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async create(req, res, next) {
        try {
            const { userId, count } = req.body;

            const generateToken = await generateTokenService.create(userId, count);

            res.json({ generateToken });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async getAllByUser(req, res, next) {
        try {
            const userId = req.body.userId;

            const generateTokens = await generateTokenService.getByUser(userId);

            res.json({ generateTokens });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;

            const generateTokens = await generateTokenService.getByUser(userId);

            res.json({ generateTokens });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async increaseCount(req, res, next) {
        try {
            const { token, count } = req.body;

            const generateToken = await generateTokenService.increaseCount(token, count);

            res.json({ generateToken });
        } catch (error) {
            next(error);
        }
    }
}

export default new GenerateTokenController();
