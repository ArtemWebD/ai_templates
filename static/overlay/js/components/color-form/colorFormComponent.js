export default class ColorFormComponent {
    _id = "colorForm";

    _container;
    _cancelButton;

    _sectionBackgroundColor;
    _sectionTextColor;
    _bodyBackgroundColor;

    get outerHTML() {
        return `
            <form id="${this._id}">
                <div class="overlay-sidebar__input">
                     <input type="color" id="background" name="background"/>
                     <input type="checkbox" name="backgroundCheckbox" />
                     <label for="background">Фон блока</label>
                 </div>
                 <div class="overlay-sidebar__input">
                     <input type="color" id="color" name="color"/>
                     <input type="checkbox" name="colorCheckbox" />
                     <label for="color">Цвет текста</label>
                 </div>
                 <div class="overlay-sidebar__input">
                     <input type="color" id="bodyColor" name="bodyColor"/>
                     <input type="checkbox" name="bodyColorCheckbox" />
                     <label for="bodyColor">Фон сайта</label>
                 </div>
                 <button class="overlay-button">Применить</button>
                 <div class="overlay-button cancel-btn" style="width: fit-content; margin-top: 10px; cursor: pointer;">Отменить</div>
            </form>
        `;
    }
    
    /**
     * @param {HTMLElement} section
     */
    init(section) {
        this.render();

        this._sectionBackgroundColor = section.style.backgroundColor;
        this._sectionTextColor = section.style.color;
        this._bodyBackgroundColor = document.body.style.backgroundColor;

        this._container.onsubmit = (e) => {
            e.preventDefault();

            this._changeColors(section);

            e.target.reset();
        }

        this._cancelButton.onclick = () => {
            this._cancelChanges(section);
        }
    }

    render() {
        this._container = document.getElementById(this._id);
        this._cancelButton = this._container.querySelector(".cancel-btn");
    }

    /**
     * @param {HTMLElement} section
     */
    _changeColors(section) {
        const formData = new FormData(this._container);

        if (formData.get("backgroundCheckbox") === "on") {
            section.setAttribute('style', `background-color: ${formData.get("background")} !important;`);
        }

        if (formData.get("colorCheckbox") === "on") {
            section.setAttribute('style', `${section.getAttribute('style') || ''}color: ${formData.get("color")} !important;`);
        }

        if (formData.get("bodyColorCheckbox") === "on") {
            document.body.setAttribute('style', `background-color: ${formData.get("bodyColor")} !important;`);
        }
    }


    /**
     * @param {HTMLElement} section
     */
    _cancelChanges(section) {
        document.body.style.backgroundColor = this._bodyBackgroundColor;
        section.style.backgroundColor = this._sectionBackgroundColor;
        section.style.color = this._sectionTextColor;
    }
}