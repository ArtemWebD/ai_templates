import EventBus from "../../modules/event-bus/eventBus.js";
import AlertComponent from "./alertComponent.js";

export default class AlertSubscriber {
    _alertComponent = new AlertComponent();

    constructor() {
        this.init();
    }

    init() {
        EventBus.subscribe("api:end", (data) => {
            if (data) {
                this._alertComponent.show(data.message, data.type);
            }
        });
    }
}