/**
 * Class for element's visible management
 */
export default class HiddenElement {
    __buttonClass;
    __elementClass;

    /**
     * 
     * @param {string} buttonClass 
     * @param {string} elementClass 
     */
    constructor(buttonClass = "hidden-element-button", elementClass = "hidden-element") {
        this.__buttonClass = buttonClass;
        this.__elementClass = elementClass;

        this.__closeAll("");
        this.__openHandler();
    }

    /**
     * Open element by html id
     * @param {string} id 
     * @returns {void}
     */
    open(id) {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.classList.toggle("hidden-element_active");
    }

    __openHandler() {
        document.body.addEventListener("click", (e) => {
            const target = e.target;

            if (!target.classList.contains(this.__buttonClass)) {
                return;
            }
            
            e.preventDefault();

            const id = target.dataset.id;
            
            this.open(id);
            this.__closeAll(id);
        });
    }

    __closeAll(id) {
        const elements = document.querySelectorAll("." + this.__elementClass);

        elements.forEach((element) => {
            if (element.id !== id) {
                element.classList.remove("hidden-element_active");
            }
        });
    }
}