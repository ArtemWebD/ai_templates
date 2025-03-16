import EventBus from "../../modules/event-bus/eventBus.js";
import MetatagsService from "../../service/metatags/metatags.service.js";
import APIStore from "../api/apiStore.js";

export default class MetatagsStore extends APIStore {
    _title;
    _description;
    _keywords;

    get title() {
        return this._title?.innerHTML;
    }

    get description() {
        return this._description?.content;
    }

    get keywords() {
        return this._keywords?.content;
    }

    set title(title) {
        this._title.outerHTML = title;
        EventBus.publish("metatags:update", { title: this.title });
    }

    set description(description) {
        this._description.outerHTML = description;
        EventBus.publish("metatags:update", { description: this.description });
    }

    set keywords(keywords) {
        this._keywords.outerHTML = keywords;
        EventBus.publish("metatags:update", { keywords: this.keywords });
    }

    init() {
        this._getTitle();
        this._getDescription();
        this._getKeywords();

        EventBus.publish("metatags:update", { title: this.title, description: this.description, keywords: this.keywords });
    }

    /**
     * 
     * @param {string | undefined} titlePrompt 
     * @param {string | undefined} descriptionPrompt 
     * @param {string | undefined} keywordsPrompt
     */
    async unify(titlePrompt, descriptionPrompt, keywordsPrompt) {
        try {
            this.__startRequest();

            const response = await MetatagsService.unify(titlePrompt, descriptionPrompt, keywordsPrompt);
            const { title, keywords, description } = response.data.result;

            if (title) {
                this.title = title;
            }

            if (description) {
                this.description = description;
            }

            if (keywords) {
                this.keywords = keywords;
            }

            this.__endRequest("Мета тэги успешно уникализированы");
        } catch (error) {
            this.__handleError(error);
        }
    }

    _getTitle() {
        this._title = document.querySelector("title");

        if (!this._title) {
            this._title = document.createElement("title");

            document.head.append(this._title);
        }
    }

    _getDescription() {
        this._description = document.querySelector('meta[name="description"]');

        if (!this._description) {
            this._description = document.createElement("meta");

            this._description.name = "description";

            document.head.append(this._description);
        }
    }

    _getKeywords() {
        this._keywords = document.querySelector('meta[name="keywords"]');

        if (!this._keywords) {
            this._keywords = document.createElement("meta");

            this._keywords.name = "keywords";

            document.head.append(this._keywords);
        }
    }
}