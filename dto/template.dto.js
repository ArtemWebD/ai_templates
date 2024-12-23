export default class TemplateDto {
    id;
    path;
    title;

    constructor(template) {
        this.id = template.id;
        this.path = template.path;
        this.title = template.title;
    }
}