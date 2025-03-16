export default class TextNodesStore {
    _textNodes = [];
    _titleNodes = [];
    _altNodes = [];

    get textNodes() {
        return this._textNodes.reduce((acc, node, i) => {
            if (node.textContent) {
                acc[i] = node.textContent.replace(/\s{2,}/g, ' ').trim();
            }

            return acc;
        }, {});
    }

    get titleNodes() {
        return this._titleNodes.reduce((acc, node, i) => {
            if (node.textContent) {
                acc[i] = node.textContent.replace(/\s{2,}/g, ' ').trim();
            }

            return acc;
        }, {});
    }

    get altNodes() {
        return this._altNodes.reduce((acc, node, i) => {
            if (node.alt) {
                acc[i] = node.alt?.replace(/\s{2,}/g, ' ')?.trim();
            }

            return acc;
        }, {});
    }

    /**
     * @param {Object} nodes
     */
    set textNodes(nodes) {
        if (Object.keys(nodes).length !== this._textNodes.length) {
            return;
        }

        Object.keys(nodes).forEach((key) => {
            const newNode = document.createTextNode(nodes[key]);
            this._textNodes[+key].replaceWith(newNode);
        });
    }

    /**
     * @param {Object} nodes
     */
    set titleNodes(nodes) {
        if (Object.keys(nodes).length !== this._titleNodes.length) {
            return;
        }

        Object.keys(nodes).forEach((key) => {
            const newNode = document.createTextNode(nodes[key]);
            this._titleNodes[+key].replaceWith(newNode);
        });
    }

    /**
     * @param {Object} nodes
     */
    set altNodes(nodes) {
        if (Object.keys(nodes).length !== this._altNodes.length) {
            return;
        }

        Object.keys(nodes).forEach((key) => {
            this._titleNodes[+key] = nodes[key];
        });
    }

    /**
     * Read text nodes from container and store them
     * @param {HTMLElement} container 
     */
    init(container = document.body) {
        this._textNodes = [];
        this._titleNodes = [];
        this._altNodes = [];

        this.getTextNodes(container);
        this.getTitleNodes(container);
        this.getAltNodes(container);
    }

    getTextNodes(container = document.body) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    const parent = node.parentNode;
                    return parent.tagName !== 'STYLE' && parent.tagName !== 'H1' && parent.tagName !== 'H2'
                        && parent.tagName !== 'H3' && parent.tagName !== 'H4' && parent.tagName !== 'H5'
                        && parent.tagName !== 'H6' && !parent.classList.contains("overlay-element")
                        && parent.tagName !== 'SCRIPT' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            // Проверка на пустой узел.
            if (currentNode.nodeValue.trim() !== "") {
                this._textNodes.push(currentNode);
            }
        }
    }

    getTitleNodes(container = document.body) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    const parent = node.parentNode;
                    return parent.tagName === 'H1' || parent.tagName === 'H2'
                        || parent.tagName === 'H3' || parent.tagName === 'H4' || parent.tagName === 'H5'
                        || parent.tagName === 'H6' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            // Проверка на пустой узел.
            if (currentNode.nodeValue.trim() !== "") {
                this._titleNodes.push(currentNode);
            }
        }
    }

    getAltNodes(container = document.body) {
        const images = Array.from(container.querySelectorAll("img"));

        this._altNodes = images.filter((el) => el.alt);
    }
}