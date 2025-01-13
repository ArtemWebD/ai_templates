import { API_URL, APIRequest } from "../api/api.js";

export default class Authorization {
    __apiRequest = new APIRequest();

    async login(email, password) {
        const response = await this.__apiRequest.createRequest({
            method: "post",
            url: "/auth/login",
            data: { email, password }
        }, "Вход успешно осуществлен");

        if (!response) {
            return;
        }

        localStorage.setItem("token", response.data.accessToken);
    }

    async register(email, name, password) {
        const response = await this.__apiRequest.createRequest({
            method: "post",
            url: "/auth/registration",
            data: { email, name, password }
        }, "Регистрация прошла успешно");

        if (!response) {
            return;
        }

        localStorage.setItem("token", response.data.accessToken);
    }

    async checkAuthorization() {
        try {
            const response = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });

            localStorage.setItem("token", response.data.accessToken);

            return true;
        } catch (error) {
            return false;
        }
    }

    async checkAdmin() {
        const response = await this.__apiRequest.createRequest({ url: "/auth/admin", method: "get" });

        if (!response) {
            return false;
        }

        return response.data.isAdmin;
    }
}