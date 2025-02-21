import generatedWhitePageService from "./generatedWhitePage.service.js";

class GeneratedWhitePageController {
    /**
     * @param {import("express").Request} req express request
     * @param {import("express").Response} res express response
     * @param {import("express").NextFunction} next express next function
     * @returns {Promise<void>}
     */
    async getAll(req, res, next) {
        try {
            const user = req.user;

            const tasks = await generatedWhitePageService.getAllByUser(user.id);

            res.json({ tasks });
        } catch (error) {
            next(error);
        }
    }
}

export default new GeneratedWhitePageController();