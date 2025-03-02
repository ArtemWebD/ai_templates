/**
 * Object that can become html element
 */
export default class ElementObject {
    id;
    title;
    path;

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} path
     */
    constructor(id, title, path) {
        this.id = id;
        this.title = title;
        this.path = path;
    }
}