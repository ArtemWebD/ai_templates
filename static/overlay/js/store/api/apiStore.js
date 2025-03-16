import EventBus from "../../modules/event-bus/eventBus.js";

export default class APIStore {
    __startRequest() {
        EventBus.publish("api:start");
    }

    __endRequest(message = "") {
        EventBus.publish(
            "api:end", 
            message ? { message, type: "success" } : undefined
        );
    }

    __handleError(error) {
        const message = error.response?.data?.message || "Произошла непредвиденная ошибка";

        EventBus.publish(
            "api:end",
            { message, type: "danger" }
        );
    }
}