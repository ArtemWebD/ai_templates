export default class AlertComponent {
    _container;

    show(message, type) {
        if (type !== "success" && type !== "danger") {
            return;
        }

        this.render(message, type);

        const styles = getComputedStyle(this._container);
        const time = (parseFloat(styles.animationDuration) + parseFloat(styles.animationDelay)) * 1000;

        setTimeout(() => this.hide(), time);
    }

    hide() {
        this._container.remove();
    }

    render(message, type) {
        const container = document.createElement("div");
        container.classList.add("overlay-alert", `overlay-alert_${type}`, "overlay-element");

        container.innerHTML = `
            <span class="overlay-alert__message">${message}</span>
        `;

        document.body.append(container);
        this._container = container;
    }
}