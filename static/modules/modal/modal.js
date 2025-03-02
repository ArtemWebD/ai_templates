/**
 * Module for modals management
 */
export default class Modal {
    __buttonClass = "modal-button";

    __openCallbacks = [];

    /**
     * @param {
     *  {
     *      id: string,
     *      callback: (button: HTMLElement, modal: HTMLElement) => Promise<void> | void
     *  }[]
     * } onOpenHandler open modal callback
     */
    constructor(onOpenHandler = undefined) {
        if (onOpenHandler) {
            this.__openCallbacks.push(...onOpenHandler);
        }

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
     * Close modal by html id
     * @param {string} id html id
     * @returns {void}
     */
    close(id) {
        const modal = document.getElementById(id);

        if (!modal) {
            return;
        }

        this.__closeModal(modal);
    }

    /**
     * Open modals by buttons that contain id
     */
    __openHandler() {
        document.body.addEventListener("click", async (e) => {
            const target = e.target;
        
            if (!target.classList.contains(this.__buttonClass)) {
                return;
            }

            e.preventDefault();

            const id = target.dataset.id;
            const modal = document.getElementById(id);

            if (!modal || !id) {
                return;
            }

            this.__openModal(modal);
            
            for (const handler of this.__openCallbacks) {
                if (handler.id === id) {
                    await handler.callback(target, modal);
                }
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
     * Make modal element hidden
     * @param {HTMLDivElement} modal modal element
     */
    __closeModal(modal) {
        modal.classList.remove("modal-visible");
        document.body.style.overflow = "";
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