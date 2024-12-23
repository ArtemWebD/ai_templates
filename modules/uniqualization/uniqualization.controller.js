import uniqualizationService from "./uniqualization.service.js";

class UniqualiztionController {
    async unique(req, res, next) {
        try {
            const { prompt, text, language } = req.body;

            const result = await uniqualizationService.unique(prompt, text, language);

            res.json({ result });
        } catch (error) {
            next(error);
        }
    }

    async getPrompt(req, res, next) {
        try {
            const prompt = await uniqualizationService.getPromptFromFile();

            res.json({ prompt });
        } catch (error) {
            next(error);
        }
    }

    async uniqueMetatags(req, res, next) {
        try {
            const { title, description, keywords } = req.body;

            const result = await uniqualizationService.uniqueMetatags(title, description, keywords);

            res.json({ result });
        } catch (error) {
            next(error);
        }
    }

    async uploadImage(req, res, next) {
        try {
            const user = req.user;
            const { id } = req.body;
            const file = req.file;

            const imagePath = await uniqualizationService.uploadImage(user, id, file);

            res.json({ imagePath });
        } catch (error) {
            next(error);
        }
    }
}

export default new UniqualiztionController();
