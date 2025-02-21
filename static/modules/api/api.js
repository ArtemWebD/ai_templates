import Alert from "../alert/alert.js";
import Loader from "../loader/loader.js";

export const API_URL = `http://${window.location.host}/api`;

const API = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

API.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

API.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        try {
            const response = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });
            localStorage.setItem("token", response.data.accessToken);

            return API.request(originalRequest);
        } catch (error) {}
    }

    throw error;
});

/**
 * Module for creating requests to API
 */
export class APIRequest {
    __API = API;

    __alert = new Alert();
    __loader = new Loader();

    //Body consists of method, url, data

    /**
     * 
     * @param {{ method: string, url: string, data: any }} body params of api request
     * @param {string | undefined} successMessage message that will show if request final successful
     * @returns {Promise<AxiosResponse>}
     */
    async createRequest(body, successMessage = "") {
        try {
            this.__loader.show();

            const response = await this.__API.request(body);

            if (successMessage) {
                this.__alert.show(successMessage, "success");
            }

            this.__loader.hide();

            return response;
        } catch (error) {
            this.__alert.show(error.response?.data?.message, "danger");
            this.__loader.hide();
            return;
        }
    }
}
