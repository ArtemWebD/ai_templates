import generatedWhitePageService from "./generatedWhitePage.service.js";

class GeneratedWhitePageController {
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