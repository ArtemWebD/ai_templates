import Authorization from "../../modules/authorization/authorization.js";

export default class AuthForm {
    __form = document.getElementById("authForm");

    __authorization = new Authorization();

    constructor() {
        this.__formHandler();
        this.__changeHandler();
    }

    async checkAuthorization() {
        const isAuth = await this.__authorization.checkAuthorization();

        if (isAuth) {
            window.location.href = `http://${window.location.host}/`;
        }
    }

    __formHandler() {
        this.__form.onsubmit = async (event) => {
            event.preventDefault();

            const emailInput = this.__form.querySelector("#email");
            const nameInput = this.__form.querySelector("#name");
            const passwordInput = this.__form.querySelector("#password");

            if (!emailInput || !passwordInput || !nameInput) {
                return;
            }

            const email = emailInput.value;
            const name = nameInput.value;
            const password = passwordInput.value;

            if (this.__form.classList.contains("auth__form_active")) {
                await this.__authorization.register(email, name, password);
                return;
            }

            await this.__authorization.login(email, password);

            this.__form.reset();

            await this.checkAuthorization();
        }
    }

    __changeHandler() {
        const formScreen = this.__form;
        const changeScreen = document.querySelector(".auth__change");

        if (!changeScreen) {
            return;
        }

        const changeButton = changeScreen.querySelector("button");

        if (!changeButton) {
            return;
        }

        changeButton.onclick = () => { 
            formScreen.classList.toggle("auth__form_active");
            changeScreen.classList.toggle("auth__change_active");
        }
    }
}
