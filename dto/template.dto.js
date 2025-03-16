export default class TemplateDto {
    id;
    path;
    title;
    pages;

    constructor(template) {
        this.id = template.id;
        this.path = template.path;
        this.title = template.title;
        this.pages = template.pages;
    }
}