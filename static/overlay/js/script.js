const host = window.location.host;

class Metatags {
    __formContainer;

    __titleEl;
    __descriptionEl;
    __keywordsEl;

    addFormContainer() {
        const container = document.createElement("div");
        container.classList.add("overlay-centre-popup", "overlay-element", "overlay-metatags");

        const title = document.querySelector("title");
        const description = document.querySelector("meta[name='description']");
        const keywords = document.querySelector("meta[name='keywords']");

        container.innerHTML = `
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
            console.log(json);
        }
    }
}

const setDefaultPrompt = async () => {
    const prompt = document.querySelector("#prompt");
    const response = await fetch(`http://${host}/unique`);

    if (!response.ok) {
        return;
    }

    prompt.value = await response.text();
}

const uniqueBlock = async (section) => {
    const prompt = document.querySelector("#prompt").value.trim();
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

    await setDefaultPrompt();
}

const sidebarHandler = (section) => {
    const sidebar = document.querySelector(".overlay-sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.add("overlay-sidebar_active");

    const background = sidebar.querySelector("#background");
    const color = sidebar.querySelector("#color");
    const bodyColor = sidebar.querySelector("#bodyColor");
    const unique = sidebar.querySelector("#unique-form");
    const close = sidebar.querySelector(".overlay-sidebar__close");
    const save = sidebar.querySelector(".overlay-sidebar__save");

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
        await uniqueBlock(section);
    }

    close.onclick = () => {
        section.innerHTML = html;
        section.style.background = backgroundDefault;
        document.body.style.background = bodyDefault;
        sidebar.classList.remove("overlay-sidebar_active");
    }

    save.onclick = () => {
        sidebar.classList.remove("overlay-sidebar_active");
    }
}

const saveHandler = () => {
    const saveButton = document.getElementById("saveTemplate");

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

const serverOverlay = () => {
    let sections = document.querySelectorAll("section");
    const popup = document.querySelector(".overlay-popup");

    if (!popup) {
        return;
    }

    const sectionsHandler = () => {
        sections.forEach((section) => {
            section.oncontextmenu = (event) => {
                event.preventDefault();

                popup.classList.add("overlay-popup_active");
    
                popup.setAttribute("style", `left: ${event.clientX}px; top: ${event.clientY}px;`);
    
                menuElementsHandler(section);
            }
        });
    }

    const overlayBlocksHandler = (section) => {
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

    const menuElementsHandler = (section) => {
        menuElements.forEach((el) => {
            el.onclick = (e) => {
                switch (e.target.dataset.target) {
                    case "remove":
                        removeBlock(section);
                        break;
                    case "cut":
                        showOverlayBlocks(section);
                        break;
                    case "sidebar":
                        sidebarHandler(section);
                        sections = document.querySelectorAll("section");
                        console.log(sections)
                        sectionsHandler();
                        break;
                    case "metatags":
                        break;
                }
            }
        });
    }

    const removeBlock = (element) => {
        element.remove();
    }

    const showOverlayBlocks = (section) => {
        section.style.visibility = "hidden";

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

    const menuElements = popup.querySelectorAll("li");

    popup.onmouseleave = () => {
        popup.classList.remove("overlay-popup_active");
    }

    popup.onclick = () => {
        popup.classList.remove("overlay-popup_active");
    }

    sectionsHandler();
}

const addMenu = () => {
    const container = document.createElement("div");
    container.classList.add("overlay-popup", "overlay-element");
    container.innerHTML = `<ul>
            <li data-target="cut">Вырезать блок</li>
            <li data-target="remove">Удалить блок</li>
            <li data-target="sidebar">Настройка блока</li>
            <li data-target="metatags">Сменить мета тэги</li>
        </ul>`;
    
    document.body.append(container);
}

const addSidebar = async () => {
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

    await setDefaultPrompt();
}

const addSaveMenu = () => {
    const container = document.createElement("div");
    container.classList.add("overlay-menu", "overlay-element");

    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");

    container.innerHTML = `
        <button id="saveTemplate">Сохранить</button>
        <a href="http://${host}/sites/${title}">Скачать</a>
    `;

    document.body.append(container);
}

enableContentEditable = () => {
    const elements = document.body.children;
    
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).setAttribute("contenteditable", "true");
    }
}

enableContentEditable();
addSaveMenu();
addSidebar();
addMenu();
serverOverlay();
saveHandler();

const metatags = new Metatags();

metatags.addFormContainer();