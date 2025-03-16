export default class SiteDto {
    id;
    path;
    title;
    templateId;
    pages;

    constructor(site) {
        this.id = site.id;
        this.path = site.path;
        this.title = site.title;
        this.templateId = site.templateId;
        this.pages = site.template?.pages;
    }
}