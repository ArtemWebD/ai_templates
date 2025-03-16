import EventBus from "../../modules/event-bus/eventBus.js";
import ImageService from "../../service/image/image.service.js";
import APIStore from "../api/apiStore.js";

export default class ImageStore extends APIStore {
    _images = [];

    /**
     * @returns {HTMLImageElement[]}
     */
    get images() {
        return this._images;
    }

    /**
     * @param {HTMLImageElement} image
     */
    set push(image) {
        this._images.push(image);

        image.addEventListener("click", (e) => {
            e.preventDefault();
            EventBus.publish("image:click", image);
        });
    }

    init() {
        const images = document.querySelectorAll("img");

        images.forEach((image) => this.push = image);
    }

    /**
     * Update src attribute
     * @param {HTMLImageElement} image 
     * @param {string} src 
     */
    update(image, src) {
        for (const img of this._images) {
            if (img.isEqualNode(image)) {
                img.src = src;
                break;
            }
        }
    }

    /**
     * Upload new image
     * @param {FormData} formData site's id and image file
     * @param {HTMLImageElement} image img element
     */
    async upload(formData, image) {
        try {
            this.__startRequest();

            const response = await ImageService.upload(formData);

            this.update(image, response.data.imagePath);

            this.__endRequest("Картинка успешно загружена");
        } catch (error) {
            this.__handleError(error);
        }
    }
}