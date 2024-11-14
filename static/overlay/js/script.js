const host = window.location.host;

class Popup {
    __formContainer;

    open() {
        this.__formContainer.classList.add("overlay-block-popup_active");
    }

    close() {
        this.__formContainer.classList.remove("overlay-block-popup_active");
    }

    __closeHandler() {
        const closeButton = this.__formContainer.querySelector(".overlay-block-popup__close");

        if (!closeButton) {
            return;
        }

        closeButton.onclick = (e) => {
            e.preventDefault();
            this.close();
        }
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
            <div class="overlay-block-popup__close"></div>
            <div class="overlay-centre-popup__container">
                <h2>Сменить мета тэги</h2>
                <span>Оставьте поля пустыми, чтобы не изменять их</span>
                <form id="metatagsForm">
                    <div class="overlay-metatags__tag">
                        <span>Title: ${title?.textContent || ""}</span>
                    </div>
                    <textarea id="meta-title" name="meta-title"></textarea>
                    <div class="overlay-metatags__tag">
                        <span>Description: ${description?.content || ""}</span>
                    </div>
                    <textarea id="meta-description" name="meta-description"></textarea>
                    <div class="overlay-metatags__tag">
                        <span>Keywords: ${keywords?.content || ""}</span>
                    </div>
                    <textarea id="meta-keywords" name="meta-keywords"></textarea>
                    <button>Изменить</button>
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

            const response = await fetch(`http://${host}/metatags`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
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
            <div class="overlay-block-popup__close"></div>
            <div class="overlay-image-popup__container">
                <h2>Сменить картинку</h2>
                <form>
                    <input type="file" id="imageFile" name="imageFile" accept="image/*" />
                    <button>Загрузить</button>
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

        form.onsubmit = (e) => {
            e.preventDefault();

            const imageFile = form.querySelector("#imageFile");

            if (!imageFile) {
                return;
            }

            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                this.__img.src = fileReader.result;
            }

            fileReader.readAsDataURL(imageFile.files[0]);

            this.close();
        }
    }
}

class Sidebar {
    __element;

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
            <form class="overlay-sidebar__input" id="unique-form">
                <label for="prompt">Запрос уникализации. Оставьте поле пустым, чтобы использовать стандартный запрос</label>
                <textarea id="prompt" name="prompt"></textarea>
                <button class="overlay-sidebar__unique">Уникализировать текст</button>
            </form>
            <button class="overlay-sidebar__save">Сохранить</button>
            <div class="overlay-sidebar__close"></div>
        `;

        document.body.append(container);

        this.__element = container;

        await this.__setDefaultPrompt();
    }

    open() {
        this.__element.classList.add("overlay-sidebar_active");
    }

    close() {
        this.__element.classList.remove("overlay-sidebar_active");
    }

    sidebarHandler(section) {
        const background = this.__element.querySelector("#background");
        const color = this.__element.querySelector("#color");
        const bodyColor = this.__element.querySelector("#bodyColor");
        const unique = this.__element.querySelector("#unique-form");
        const close = this.__element.querySelector(".overlay-sidebar__close");
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
            await this.__uniqueBlock(section);
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
        const text = section.outerHTML;

        const response = await fetch(`http://${host}/unique`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ text, prompt }),
        });
        
        if (!response.ok) {
            return;
        }
        
        const result = await response.text();

        section.innerHTML = result;
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
                        this.sectionsHandler();
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

        overlayBlocksHandler(section);
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
            <button id="saveTemplate">Сохранить</button>
            <a href="http://${host}/sites/${title}">Скачать</a>
        `;

        document.body.append(container);
        this.__element = container;

        this.__saveHandler();
    }

    __saveHandler() {
        const saveButton = this.__element.querySelector("#saveTemplate");

        if (!saveButton) {
            return;
        }

        saveButton.onclick = async () => {
            saveButton.disabled = true;

            const urlParams = new URLSearchParams(window.location.search);
            const title = urlParams.get("title");
            const html = document.documentElement.outerHTML;
            const body = JSON.stringify({ title, html });

            await fetch(`http://${host}/save`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body,
            });

            saveButton.disabled = false;
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