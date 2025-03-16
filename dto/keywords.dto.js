export default class KeywordsDto {
    id;
    words;
    selector;
    templateId;

    constructor(keywords) {
        this.id = keywords.id;
        this.words = keywords.words;
        this.selector = keywords.selector;
        this.templateId = keywords.templateId;
    }
}