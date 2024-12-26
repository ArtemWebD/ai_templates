import { APIRequest } from "../../modules/api/api.js";

const host = window.location.host;

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

    __apiRequest = new APIRequest();

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

            const title = form.querySelector("#meta-title");
            const description = form.querySelector("#meta-description");
            const keywords = form.querySelector("#meta-keywords");

            if (!title || !description || !keywords) {
                return;
            }

            const data = {
                title: title.value,
                description: description.value,
                keywords: keywords.value,
            };

            button.disabled = true;

            const response = await this.__apiRequest.createRequest({
                method: "POST",
                data,
                url: `/uniqualization/metatags`
            }, "Мета тэги успешно изменены");

            if (!response) {
                button.disabled = false;
                return;
            }

            const json = response.data.result;

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
        }
    }
}

class Images extends Popup {
    __formContainer;
    __img;

    __apiRequest = new APIRequest();

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
            const id = urlParams.get("id");

            const formData = new FormData();

            formData.append("id", id);
            formData.append("image", imageFile.files[0]);

            const button = form.querySelector("button");

            button.disabled = true;

            const response = await this.__apiRequest.createRequest({
                method: "POST",
                url: "/uniqualization/image",
                data: formData
            }, "Картинка успешно изменена");

            if (!response) {
                button.disabled = false;
                return;
            }

            this.__img.src = await response.data.imagePath;

            button.disabled = false;

            this.close();
        }
    }
}

class Sidebar {
    __element;

    __popupOverlay = PopupOverlay.getInstance();

    __apiRequest = new APIRequest();

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

            button.disabled = true;

            await this.__uniqueBlock(section);

            button.disabled = false;
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

        if (isAllBlocks.checked) {
            const sections = Array.from(document.querySelectorAll("section"));

            for (let i = 0; i < sections.length; i++) {
                if (!sections[i].classList.contains("no-unique")) {
                    await this.__uniqueOneSection(sections[i], prompt, language);
                    await this.__uniqueAltAttr(sections[i], prompt, language);
                }
            }

            return;
        }

        if (!section.classList.contains("no-unique")) {
            await this.__uniqueOneSection(section, prompt, language);
            await this.__uniqueAltAttr(section, prompt, language);
        }
    }

    async __uniqueOneSection(section, prompt, language) {
        const textNodesArray = [];

        textNodesArray.push(...this.__getAllTextNodes(section));
        
        const textNodesContent = textNodesArray.reduce((acc, value, i) => {
            //Удаление двойных пробелов
            acc[i] = value.textContent.replace(/\s{2,}/g, ' ').trim();

            return acc;
        }, {});

        const response = await this.__apiRequest.createRequest({
            method: "POST",
            url: "/uniqualization/unique",
            data: { text: textNodesContent, prompt, language }
        }, "Блок успешно уникализирован");

        if (!response) {
            return;
        }

        const result = JSON.parse(response.data.result);

        Object.keys(result).forEach((key) => {
            if (textNodesArray[+key]) {
                const newNode = document.createTextNode(result[key]);
                textNodesArray[+key].replaceWith(newNode);
            }
        });
    }

    async __uniqueAltAttr(section, prompt, language) {
        //Array of img elements
        const images = [];
        const elements = this.__getAllImgElements(section);

        elements.forEach((el) => {
            if (el.alt.trim().length) {
                images.push(el);
            }
        });

        //Object of alt attributes content
        const imagesContent = images.reduce((acc, value, i) => {
            acc[i] = value.alt;

            return acc;
        }, {});

        const response = await this.__apiRequest.createRequest({
            method: "POST",
            url: "/uniqualization/unique",
            data: { text: imagesContent, prompt, language },
        });

        if (!response) {
            return;
        }
        
        const result = JSON.parse(response.data.result);

        Object.keys(result).forEach((key) => {
            if (images[+key]) {
                images[+key].alt = result[key];
            }
        });
    }

    __getSectionTextNodes(sectionElement) {
        const result = {};
        
        // Получаем все элементы внутри section (включая текстовые узлы)
        const allElements = sectionElement.querySelectorAll('*');
    
        allElements.forEach(element => {
            // Пропускаем текстовые ноды
            if(element.nodeType === Node.TEXT_NODE) {
                return
            }
            
            const selector = this.__getElementSelector(element);
            
            let textContent = '';
            
            // Собираем текст только прямых потомков, без текста дочерних элементов
            Array.from(element.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent += node.textContent;
                }
            });
            
            
            
        //   Удаляем лишние пробелы и переводы строк
            textContent = textContent.trim();    
    
            if (textContent) {
                result[selector] = textContent;
            }
        });
        
    
        return result;
    }

    __getElementSelector(element) {
        if (!element || !(element instanceof Element)) {
          return "";
        }
      
        let selector = element.tagName.toLowerCase();
      
        if (element.id) {
          selector += `#${element.id}`;
        }
      
        if (element.className) {
          selector += `.${Array.from(element.classList).join(".")}`;
        }
      
        
        // Ищем родительские элементы и строим селектор
        let parent = element.parentElement;
      
          while (parent && parent.tagName.toLowerCase() !== 'section') {
              let parentSelector = parent.tagName.toLowerCase();
              if (parent.id) {
                  parentSelector += `#${parent.id}`;
                }
      
                if (parent.className) {
                  parentSelector += `.${Array.from(parent.classList).join(".")}`;
                }
               selector = `${parentSelector} > ${selector}`
              parent = parent.parentElement
        }
       
      
        return selector;
      }

    __getAllTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                const parent = node.parentNode;
                return parent.tagName !== 'STYLE' && parent.tagName !== 'SCRIPT' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
    
        const textNodes = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            // Проверка на пустой узел.
            if (currentNode.nodeValue.trim() !== "") {
                textNodes.push(currentNode);
            }
        }
        return textNodes;
    }

    __getAllImgElements(element) {
        const images = Array.from(element.querySelectorAll("img"));
        //Return array of images without element with empty alt attr
        return images.filter((el) => el.alt);
    }

    async __setDefaultPrompt() {
        const prompt = this.__element.querySelector("#prompt");
        const response = await this.__apiRequest.createRequest({
            url: "/uniqualization/unique",
            method: "get"
        });

        if (!response) {
            return;
        }

        prompt.value = await response.data.prompt;
    }
}

class ContextMenu {
    __element;
    __switchElement;

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
                <li class="overlay-popup__switch" data-target="switch"></li>
            </ul>`;
        
        document.body.append(container);
        this.__element = container;
        this.__switchElement = this.__element.querySelector(".overlay-popup__switch");

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

                this.__switchElement.innerText = section.classList.contains("no-unique") ? "Включить уникализацию" : "Отключить уникализацию";

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
                    case "switch":
                        section.classList.toggle("no-unique");
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

    __apiRequest = new APIRequest();

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
            saveButton.disabled = true;

            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            const html = document.documentElement.outerHTML;
            const data = { id, html };

            await this.__apiRequest.createRequest({
                url: "/site/save",
                method: "POST",
                data,
            }, "Проект успешно сохранен");

            saveButton.disabled = false;
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

const enableContentEditable = () => {
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