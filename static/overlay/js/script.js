const host = window.location.host;

class CustomFetch {
    __alert = new Alert();

    async fetch(url, body, successMessage = "", errorMessage = "") {
        const response = await fetch(url, body);

        if (!response.ok) {
            if (errorMessage) {
                this.__alert.show(errorMessage, "danger");
            }

            return;
        }

        if (successMessage) {
            this.__alert.show(successMessage, "success");
        }

        return response;
    }
}

class Alert {
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

    __hideHandler(element) {
        const styles = getComputedStyle(element);
        const time = (parseFloat(styles.animationDuration) + parseFloat(styles.animationDelay)) * 1000;

        setTimeout(() => element.remove(), time);
    }
}

class Loader {
    __element;

    show() {
        const container = document.createElement("div");
        container.classList.add("overlay-loader", "overlay-element");

        container.innerHTML = `
            <span class="overlay-loader__element"></span>
        `;

        document.body.append(container);
        this.__element = container;
    }

    hide() {
        if (!this.__element) {
            return;
        }

        this.__element.remove();
    }
}

class Popup {
    __formContainer;

    __popupOverlay = PopupOverlay.getInstance();

    open() {
        this.__formContainer.classList.add("overlay-block-popup_active");
        this.__popupOverlay.show();
    }

    close() {
        this.__formContainer.classList.remove("overlay-block-popup_active");
        this.__popupOverlay.hide();
    }

    __closeHandler() {
        const closeButton = this.__formContainer.querySelector(".overlay-close-element");

        if (!closeButton) {
            return;
        }

        closeButton.onclick = (e) => {
            e.preventDefault();
            this.close();
        }
    }
}

class PopupOverlay {
    __element;

    __saveMenu = SaveMenu.getInstance();

    static __instance;

    static getInstance() {
        if (!PopupOverlay.__instance) {
            PopupOverlay.__instance = new PopupOverlay();
        }

        return PopupOverlay.__instance;
    }

    addElement() {
        const container = document.createElement("div");
        container.classList.add("overlay-popup-overlay", "overlay-element");

        document.body.append(container);
        this.__element = container;
    }

    show() {
        document.body.style.overflow = "hidden";
        this.__element.classList.add("overlay-popup-overlay__active");
        this.__saveMenu.hide();
    }

    hide() {
        document.body.style.overflow = "inherit";
        this.__element.classList.remove("overlay-popup-overlay__active");
        this.__saveMenu.show();
    }
}

class Metatags extends Popup {
    __formContainer;

    __titleEl;
    __descriptionEl;
    __keywordsEl;

    static __instance;

    static getInstance() {
        if (!Metatags.__instance) {
            Metatags.__instance = new Metatags();
        }

        return Metatags.__instance;
    }

    addFormContainer() {
        const container = document.createElement("div");
        container.classList.add("overlay-centre-popup", "overlay-block-popup", "overlay-element", "overlay-metatags");

        const title = document.querySelector("title");
        const description = document.querySelector("meta[name='description']");
        const keywords = document.querySelector("meta[name='keywords']");

        container.innerHTML = `
            <div class="overlay-close-element"></div>
            <div class="overlay-centre-popup__container">
                <h2>Сменить мета тэги</h2>
                <span>Введите в поля запрос на изменение тэгов. Оставьте поля пустыми, чтобы не изменять их</span>
                <form id="metatagsForm">
                    <div class="overlay-metatags__tag">
                        <span>Title: ${title?.textContent || ""}</span>
                    </div>
                    <textarea class="overlay-input" id="meta-title" name="meta-title"></textarea>
                    <div class="overlay-metatags__tag">
                        <span>Description: ${description?.content || ""}</span>
                    </div>
                    <textarea class="overlay-input" id="meta-description" name="meta-description"></textarea>
                    <div class="overlay-metatags__tag">
                        <span>Keywords: ${keywords?.content || ""}</span>
                    </div>
                    <textarea class="overlay-input" id="meta-keywords" name="meta-keywords"></textarea>
                    <button class="overlay-button">Изменить</button>
                </form>
            </div>
        `;

        this.__titleEl = title;
        this.__descriptionEl = description;
        this.__keywordsEl = keywords;

        document.body.append(container);
        this.__formContainer = container;

        this.__addFormHandler();
        this.__closeHandler();
    }

    __addFormHandler() {
        const form = this.__formContainer.querySelector("#metatagsForm");

        if (!form) {
            return;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();

            const button = form.querySelector("button");
            const loader = new Loader();

            const title = form.querySelector("#meta-title");
            const description = form.querySelector("#meta-description");
            const keywords = form.querySelector("#meta-keywords");

            if (!title || !description || !keywords) {
                return;
            }

            const body = {
                title: title.value,
                description: description.value,
                keywords: keywords.value,
            };

            button.disabled = true;
            loader.show();

            const customFetch = new CustomFetch();

            const response = await customFetch.fetch(`http://${host}/metatags`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                }
            }, "Мета тэги успешно изменены", "Произошла непредвиденная ошибка, попробуйте отправить запрос снова");

            if (!response) {
                button.disabled = false;
                loader.hide();
                return;
            }

            const json = await response.json();

            if (json.title) {
                document.querySelector("title").outerHTML = json.title;
            }

            if (json.description) {
                document.querySelector("meta[name='description']").outerHTML = json.description;
            }

            if (json.keywords) {
                document.querySelector("meta[name='keywords']").outerHTML = json.keywords;
            }

            button.disabled = false;
            loader.hide();
        }
    }
}

class Images extends Popup {
    __formContainer;
    __img;

    static __instance;

    static getInstance() {
        if (!Images.__instance) {
            Images.__instance = new Images();
        }

        return Images.__instance;
    }

    addFormContainer() {
        const container = document.createElement("div");
        container.classList.add("overlay-image-popup", "overlay-block-popup", "overlay-element", "overlay-metatags");

        container.innerHTML = `
            <div class="overlay-close-element"></div>
            <div class="overlay-image-popup__container">
                <h2>Сменить картинку</h2>
                <form>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" />
                    <button class="overlay-button">Загрузить</button>
                </form>
            </div>
        `;

        document.body.append(container);

        this.__formContainer = container;

        this.__imageClickHandler();
        this.__formHandler();
        this.__closeHandler();
    }

    __imageClickHandler() {
        const img = document.querySelectorAll("img");

        img.forEach((el) => {
            el.onclick = (e) => {
                e.preventDefault();

                this.open();
                this.__img = el;
            }
        });
    }

    __formHandler() {
        const form = this.__formContainer.querySelector("form");

        if (!form) {
            return;
        }

        form.onsubmit = async (e) => {
            e.preventDefault();

            const imageFile = form.querySelector("#imageFile");

            if (!imageFile) {
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const siteTitle = urlParams.get("title");

            const formData = new FormData();

            formData.append("siteTitle", siteTitle);
            formData.append("image", imageFile.files[0]);

            const button = form.querySelector("button");
            const loader = new Loader();

            button.disabled = true;
            loader.show();

            const customFetch = new CustomFetch();

            const response = await customFetch.fetch(`http://${host}/image`, {
                method: "POST",
                body: formData
            }, "Картинка успешно изменена", "При загрузке картинки произошла ошибка, попробуйте снова");

            if (!response) {
                button.disabled = false;
                loader.hide()
                return;
            }

            this.__img.src = await response.text();

            button.disabled = false;
            loader.hide();

            this.close();
        }
    }
}

class Sidebar {
    __element;

    __popupOverlay = PopupOverlay.getInstance();

    static __instance;

    static getInstance() {
        if (!Sidebar.__instance) {
            Sidebar.__instance = new Sidebar();
        }

        return Sidebar.__instance;
    }

    async addElement() {
        const container = document.createElement("div");
        container.classList.add("overlay-sidebar", "overlay-element");
        container.innerHTML = `
            <div class="overlay-sidebar__element">
                <h3>Цвета</h3>
                <div class="overlay-sidebar__input">
                    <input type="color" id="background" name="background"/>
                    <label for="background">Фон блока</label>
                </div>
                <div class="overlay-sidebar__input">
                    <input type="color" id="color" name="color"/>
                    <label for="color">Цвет текста</label>
                </div>
                <div class="overlay-sidebar__input">
                    <input type="color" id="bodyColor" name="bodyColor"/>
                    <label for="bodyColor">Фон сайта</label>
                </div>
            </div>
            <div class="overlay-sidebar__element">
                <h3>Уникализация текста</h3>
                <form class="overlay-sidebar__input" id="unique-form">
                    <label for="prompt">Запрос уникализации. Оставьте поле пустым, чтобы использовать стандартный запрос</label>
                    <textarea class="overlay-input" id="prompt" name="prompt"></textarea>
                    <label for="language">Язык, на котором будет возвращен результат. Оставьте поле пустым, чтобы использовать язык по умолчанию (русский)</label>
                    <input class="overlay-input" type="text" id="language" name="language" placeholder="Язык (необязательно)"></input>
                    <div class="overlay-sidebar__checkbox">
                        <input type="checkbox" id="allBlocks" name="allBlocks" />
                        <label for="allBlocks">Применить запрос ко всем блокам на странице</label>
                    </div>
                    <button class="overlay-button overlay-sidebar__unique">Уникализировать текст</button>
                </form>
            </div>
            <button class="overlay-button overlay-sidebar__save">Сохранить</button>
            <div class="overlay-close-element"></div>
        `;

        document.body.append(container);

        this.__element = container;

        await this.__setDefaultPrompt();
    }

    open() {
        this.__element.classList.add("overlay-sidebar_active");
        this.__popupOverlay.show();
    }

    close() {
        this.__element.classList.remove("overlay-sidebar_active");
        this.__popupOverlay.hide();
    }

    sidebarHandler(section) {
        const background = this.__element.querySelector("#background");
        const color = this.__element.querySelector("#color");
        const bodyColor = this.__element.querySelector("#bodyColor");
        const unique = this.__element.querySelector("#unique-form");
        const close = this.__element.querySelector(".overlay-close-element");
        const save = this.__element.querySelector(".overlay-sidebar__save");

        if (!background || !color || !bodyColor || !unique || !close || !save) {
            return;
        }

        const html = section.innerHTML;
        const backgroundDefault = section.style.background;
        const bodyDefault = document.body.style.background;

        background.onchange = () => {
            section.style.setProperty("background", background.value, "important");
        }

        color.onchange = () => {
            section.style.setProperty("color", color.value, "important");
            
            section.querySelectorAll("*").forEach((el) => {
                el.style.setProperty("color", color.value, "important");
            });
        }

        bodyColor.onchange = () => {
            document.body.style.setProperty("background", bodyColor.value, "important");
        }

        unique.onsubmit = async (event) => {
            event.preventDefault();

            const button = unique.querySelector("button");
            const loader = new Loader();

            button.disabled = true;
            loader.show();

            await this.__uniqueBlock(section);

            button.disabled = false;
            loader.hide();
        }

        close.onclick = () => {
            section.innerHTML = html;
            section.style.background = backgroundDefault;
            document.body.style.background = bodyDefault;
            this.close();
        }

        save.onclick = () => {
            this.close();
        }
    }

    async __uniqueBlock(section) {
        const prompt = this.__element.querySelector("#prompt").value.trim();
        const isAllBlocks = this.__element.querySelector("#allBlocks");
        const languageInput = this.__element.querySelector("#language");

        if (!isAllBlocks || !languageInput) {
            return;
        }

        const language = languageInput.value.trim();

        if (!isAllBlocks.checked) {
            await this.__uniqueOneSection(section, prompt, language);
            return;
        }

        const sections = Array.from(document.querySelectorAll("section"));

        for (let i = 0; i < sections.length; i++) {
            await this.__uniqueOneSection(sections[i], prompt, language);
        }
    }

    async __uniqueOneSection(section, prompt, language) {
        const textNodesArray = this.__getAllTextNodes(section);
        const textNodesContent = textNodesArray.reduce((acc, value) => {
            acc += value.textContent + "\n";

            return acc;
        }, "");

        const customFetch = new CustomFetch();

        const response = await customFetch.fetch(`http://${host}/unique`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ text: textNodesContent, prompt, language }),
        }, "Блок успешно уникализирован", "В процессе уникализации произошла ошибка");

        if (!response) {
            return;
        }
        
        const result = await response.text();
        const resultArray = result.split("\n")
            .map((value) => value.trim())
            .filter((element) => element && element.length !== 0);
        
        textNodesArray.forEach((value, i) => {
            const newNode = document.createTextNode(resultArray[i]);
            value.replaceWith(newNode);
        });
    }

    __getAllTextNodes(element) {
        const textNodes = [];
        let node;

        const filter = {
            acceptNode: function(node) {
            // Исключаем узлы типа Node.ELEMENT_NODE, которые являются style или script
            if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'STYLE' || node.tagName === 'SCRIPT')) {
                return NodeFilter.FILTER_REJECT; // Отклоняем узел
            }
            // Для всех остальных узлов, кроме текстовых (Node.TEXT_NODE) возвращаем NodeFilter.FILTER_SKIP
            // Это необходимо, чтобы TreeWalker не заходил в дочерние элементы ненужных узлов
            return node.nodeType === Node.TEXT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; 
            }
        };
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, filter, false);
        
        while (node = walker.nextNode()) {
            if (node.nodeValue.trim() !== "") {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }

    async __setDefaultPrompt() {
        const prompt = this.__element.querySelector("#prompt");
        const response = await fetch(`http://${host}/unique`);

        if (!response.ok) {
            return;
        }

        prompt.value = await response.text();
    }
}

class ContextMenu {
    __element;

    static __instance;

    static getInstance() {
        if (!ContextMenu.__instance) {
            ContextMenu.__instance = new ContextMenu();
        }

        return ContextMenu.__instance;
    }

    addElement() {
        const container = document.createElement("div");
        container.classList.add("overlay-popup", "overlay-element");
        container.innerHTML = `<ul>
                <li data-target="cut">Вырезать блок</li>
                <li data-target="remove">Удалить блок</li>
                <li data-target="sidebar">Настройка блока</li>
                <li data-target="metatags">Сменить мета тэги</li>
            </ul>`;
        
        document.body.append(container);
        this.__element = container;

        this.__elementCloseHandler();
        this.__sectionsHandler();
    }

    open() {
        this.__element.classList.add("overlay-popup_active");
    }

    close() {
        this.__element.classList.remove("overlay-popup_active");
    }

    __sectionsHandler() {
        const sections = document.querySelectorAll("section");

        sections.forEach((section) => {
            section.oncontextmenu = (event) => {
                event.preventDefault();

                this.open();
    
                this.__element.setAttribute("style", `left: ${event.clientX}px; top: ${event.clientY}px;`);
    
                this.__menuElementsHandler(section);
            }
        });
    }

    __menuElementsHandler(section) {
        this.__element.querySelectorAll("li").forEach((el) => {
            el.onclick = (e) => {
                switch (e.target.dataset.target) {
                    case "remove":
                        section.remove();
                        break;
                    case "cut":
                        this.__showOverlayBlocks(section);
                        break;
                    case "sidebar":
                        const sidebar = Sidebar.getInstance();
                        sidebar.open();
                        sidebar.sidebarHandler(section);
                        this.__sectionsHandler();
                        break;
                    case "metatags":
                        const metatags = Metatags.getInstance();
                        metatags.open();
                        break;
                }
            }
        });
    }

    __showOverlayBlocks(section) {
        section.style.visibility = "hidden";

        const sections = document.querySelectorAll("section");

        sections.forEach((el) => {
            if (section === el) {
                return;
            }

            const overlayBlock = document.createElement("div")

            overlayBlock.classList.add("overlay-block", "overlay-element");
            overlayBlock.innerHTML = "<span>Вставить блок здесь</span>";
            
            el.after(overlayBlock);
        });

        this.__overlayBlocksHandler(section);
    }

    __overlayBlocksHandler(section) {
        const blocks = document.querySelectorAll(".overlay-block");

        blocks.forEach((block) => {
            block.onclick = () => {
                section.remove();
                section.style.visibility = "visible";
                
                block.replaceWith(section);

                blocks.forEach((el) => el.remove());
            }
        });
    }

    __elementCloseHandler() {
        this.__element.onmouseleave = () => {
            this.close();
        }
    
        this.__element.onclick = () => {
            this.close();
        }
    }
}

class SaveMenu {
    __element;

    static __instance;

    static getInstance() {
        if (!SaveMenu.__instance) {
            SaveMenu.__instance = new SaveMenu();
        }

        return SaveMenu.__instance;
    }

    addElement() {
        const container = document.createElement("div");
        container.classList.add("overlay-menu", "overlay-element");

        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get("title");

        container.innerHTML = `
            <button class="overlay-button" id="saveTemplate">Сохранить</button>
            <a class="overlay-link" href="http://${host}/sites/${title}">Скачать</a>
        `;

        document.body.append(container);
        this.__element = container;

        this.__saveHandler();
        this.__scrollHandler();
    }

    hide() {
        this.__element.classList.add("overlay-menu__hidden");
    }

    show() {
        this.__element.classList.remove("overlay-menu__hidden");
    }

    __saveHandler() {
        const saveButton = this.__element.querySelector("#saveTemplate");

        if (!saveButton) {
            return;
        }

        saveButton.onclick = async () => {
            const loader = new Loader();

            loader.show();
            saveButton.disabled = true;

            const urlParams = new URLSearchParams(window.location.search);
            const title = urlParams.get("title");
            const html = document.documentElement.outerHTML;
            const body = JSON.stringify({ title, html });

            const customFetch = new CustomFetch();

            await customFetch.fetch(`http://${host}/save`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body,
            }, "Проект успешно сохранен", "При сохранении проекта произошла ошибка, попробуйте повторить попытку позже");

            saveButton.disabled = false;
            loader.hide();
        }
    }

    __scrollHandler() {
        let prevScrollPos = window.pageYOffset;

        window.onscroll = (e) => {
            const currentScrollPos = window.pageYOffset;

            if (prevScrollPos > currentScrollPos) {
                this.show();
            } else {
                this.hide();
            }

            prevScrollPos = currentScrollPos;
        }
    }
}

enableContentEditable = () => {
    const elements = document.body.children;
    
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).setAttribute("contenteditable", "true");
    }
}

enableContentEditable();

const metatags = Metatags.getInstance();

metatags.addFormContainer();

const images = Images.getInstance();

images.addFormContainer();

const sidebar = Sidebar.getInstance();

sidebar.addElement();

const contextMenu = ContextMenu.getInstance();

contextMenu.addElement();

const saveMenu = SaveMenu.getInstance();

saveMenu.addElement();

const popupOverlay = PopupOverlay.getInstance();

popupOverlay.addElement();