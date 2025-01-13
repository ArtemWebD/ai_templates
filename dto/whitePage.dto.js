export default class WhitePageDto {
    id;
    title;
    path;

    constructor(whitePage) {
        this.id = whitePage.id;
        this.title = whitePage.title;
        this.path = whitePage.path;
    }
}