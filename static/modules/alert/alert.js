/**
 * Module for notifications
 */
export default class Alert {
    /**
     * Show notification
     * @param {string} message notification's message
     * @param {"success" | "danger"} type type of notification
     * @returns {void}
     */
    show(message, type) {
        if (type !== "success" && type !== "danger") {
            return;
        }

        const container = document.createElement("div");
        container.classList.add("overlay-alert", `overlay-alert_${type}`, "overlay-element");

        container.innerHTML = `
            <span class="overlay-alert__message">${message}</span>
        `;

        document.body.append(container);

        this.__hideHandler(container);
    }

    /**
     * Hide alert after appearance
     * @param {HTMLDivElement} element alert dom element
     * @returns {void}
     */
    __hideHandler(element) {
        const styles = getComputedStyle(element);
        const time = (parseFloat(styles.animationDuration) + parseFloat(styles.animationDelay)) * 1000;

        setTimeout(() => element.remove(), time);
    }
}