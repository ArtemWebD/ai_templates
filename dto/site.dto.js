export default class SiteDto {
    id;
    path;
    title;
    templateId;

    constructor(site) {
        this.id = site.id;
        this.path = site.path;
        this.title = site.title;
        this.templateId = site.templateId;
    }
}