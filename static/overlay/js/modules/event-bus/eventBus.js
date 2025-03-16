export default class EventBus {
    static _subscribers = {};

    /**
     * Subscribe to event
     * @param {string} event event name
     * @param {(...params) => any} callback event callback
     */
    static subscribe(event, callback) {
        if (!EventBus._subscribers[event]) {
            EventBus._subscribers[event] = [];
        }

        EventBus._subscribers[event].push(callback);
    }

    /**
     * Emit event
     * @param {string} event event name
     * @param {(...params) => any} callback event callback
     */
    static publish(event, data) {
        if (EventBus._subscribers[event]) {
            EventBus._subscribers[event].forEach((callback) => callback(data));
        }
    }
}