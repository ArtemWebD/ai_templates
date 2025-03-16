import EventBus from "../../modules/event-bus/eventBus.js";
import LoaderComponent from "./loaderComponent.js";

export default class LoaderSubscriber {
    _loaderComponent = new LoaderComponent();

    constructor() {
        this.init();
    }

    init() {
        EventBus.subscribe("api:start", () => this._loaderComponent.show());
        EventBus.subscribe("api:end", () => this._loaderComponent.hide());
    }
}