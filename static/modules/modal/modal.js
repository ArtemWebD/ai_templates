export default class Modal {
    __buttonClass = ".modal-button";

    constructor() {
        this.__openHandler();
        this.__closeHandler();
    }

    open(id) {
        const modal = document.getElementById(id);

        if (!modal) {
            return;
        }

        this.__openModal(modal);
    }

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

    __openModal(modal) {
        modal.classList.add("modal-visible");
        document.body.style.overflow = "hidden";
    }

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