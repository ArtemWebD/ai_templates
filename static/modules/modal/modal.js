/**
 * Module for modals management
 */
export default class Modal {
    __buttonClass = ".modal-button";

    constructor() {
        this.__openHandler();
        this.__closeHandler();
    }

    /**
     * Open modal by html id
     * @param {string} id html id
     * @returns {void}
     */
    open(id) {
        const modal = document.getElementById(id);

        if (!modal) {
            return;
        }

        this.__openModal(modal);
    }

    /**
     * Open modals by buttons that contain id
     */
    __openHandler() {
        const buttons = document.querySelectorAll(this.__buttonClass);

        buttons.forEach((button) => {
            button.onclick = (e) => {
                e.preventDefault();

                const id = button.dataset.target;
                const modal = document.getElementById(id);

                if (!modal) {
                    return;
                }

                this.__openModal(modal);
            }
        });
    }

    /**
     * Make modal element visible
     * @param {HTMLDivElement} modal modal element
     */
    __openModal(modal) {
        modal.classList.add("modal-visible");
        document.body.style.overflow = "hidden";
    }

    /**
     * Make modal element hidden by close buttons click
     */
    __closeHandler() {
        const modals = document.querySelectorAll(".modal");

        modals.forEach((modal) => {
            const closeButtons = modal.querySelectorAll(".close-modal");

            closeButtons.forEach((button) => {
                button.onclick = (e) => {
                    e.preventDefault();

                    modal.classList.remove("modal-visible");
                    document.body.style.overflow = "";
                }
            });
        });
    }
}