import { KeywordsModel } from "../../database.js";
import KeywordsDto from "../../dto/keywords.dto.js";
import ApiError from "../exceptions/api-error.js";

class KeywordsService {
    /**
     * @param {number} templateId template's id
     * @param {string} selector selector of section
     * @param {string} page path to page
     * @returns {Promise<KeywordsDto | null>}
     */
    async getBySelector(templateId, selector, page) {
        const keywords = await KeywordsModel.findOne({ where: { templateId, selector, page } });

        if (!keywords) {
            return null;
        }

        return new KeywordsDto(keywords);
    }

    /**
     * @param {number} templateId 
     * @param {string} selector 
     * @param {string[]} words
     * @param {string} page
     * @returns {Promise<KeywordsDto>}
     */
    async create(templateId, selector, words, page) {
        const keywords = await KeywordsModel.create({ templateId, selector, words, page });

        return new KeywordsDto(keywords);
    }

    /**
     * @param {number} templateId 
     * @param {string} selector 
     * @param {string[]} words
     * @param {string} page
     * @returns {Promise<KeywordsDto>} 
     */
    async update(templateId, selector, words, page) {
        const keywords = await KeywordsModel.findOne({ where: { templateId, selector, page } });

        if (!keywords) {
            throw ApiError.BadRequest("Указанный шаблон или селектор не найден");
        }

        keywords.words = words;

        const result = await keywords.save();

        return new KeywordsDto(result);
    }
}

export default new KeywordsService();
