export default class Sidebar {
    __element;
    __buttonClass = ".modal-sidebar";

    constructor() {
        this.__addElement();
    }

    open() {
        this.__element.classList.add("overlay-sidebar_active");
    }

    close() {
        this.__element.classList.remove("overlay-sidebar_active");
    }

    __addElement() {
        const container = document.createElement("div");
        container.classList.add("overlay-sidebar", "overlay-element");
        container.innerHTML = `
            <div class="overlay-sidebar__element">
                <h3>Настройки генерации</h3>
                <small>Кликните по элементу на странице и напишите для него промпт</small>
                <br>
                <small><b>Выбор элементов продолжает работать при скрытии формы</b></small>
                <form class="overlay-sidebar__input" id="json-form">
                    
                </form>
            </div>
            <button class="overlay-button overlay-sidebar__save">Сохранить</button>
            <div class="overlay-close-element"></div>
        `;

        document.body.append(container);

        this.__element = container;

        this.__closeHandler();
        this.__openHandler();
    }

    __closeHandler() {
        const button = this.__element.querySelector(".overlay-close-element");

        button.onclick = () => {
            this.close();
        }
    }

    __openHandler() {
        const buttons = document.querySelectorAll(this.__buttonClass);

        buttons.forEach((button) => {
            button.onclick = (e) => {
                e.preventDefault();

                this.open();
            }
        });
    }
}