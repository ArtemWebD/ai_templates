import { API } from "../../modules/api/api.js";

export default class ImageService {
    /**
     * @param {FormData} data site's id and image file
     * @returns {Axios.AxiosXHR<{ imagePath: string }>}
     */
    static async upload(data) {
        return API.post("/uniqualization/image", data);
    }
}