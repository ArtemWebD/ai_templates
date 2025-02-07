export default class GeneratedWhitePageDto {
    id;
    status;
    whitePageId;
    title;
    whitePageTitle;

    constructor(generatedWhitePage) {
        this.id = generatedWhitePage.id;
        this.status = generatedWhitePage.status;
        this.whitePageId = generatedWhitePage.whitePageId;
        this.title = generatedWhitePage.title;
        this.whitePageTitle = generatedWhitePage?.whitePage?.title;
    }
}