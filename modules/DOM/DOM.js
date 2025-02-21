import jsdom from "jsdom";

/**
 * Module for working with DOM document
 */
class DOM {
    /**
     * Add server's scripts to document
     * @param {string | Buffer} file html data
     * @param {string} host host of server
     * @returns {string} serialized DOM
     */
    addOverlayScripts(file, host) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        const script = dom.window.document.createElement("script");
        script.src = `${host}static/overlay/js/script.js`;
        script.classList.add("overlay-script");
        script.defer = true;
        script.type = "module";

        const axiosScript = dom.window.document.createElement("script");
        axiosScript.src = `https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js`;
        axiosScript.classList.add("overlay-script");
        axiosScript.defer = true;

        const styles = ["modules/alert/alert.css", "modules/loader/loader.css", "overlay/css/style.css"];

        styles.forEach((link) => {
            const style = dom.window.document.createElement("link");
            style.href = `${host}static/${link}`;
            style.rel = "stylesheet";
            style.classList.add("overlay-script");

            dom.window.document.body.append(style);
        });

        dom.window.document.body.append(axiosScript);
        dom.window.document.body.append(script);

        return dom.serialize();
    }

    /**
     * Add server's json editor scripts to document
     * @param {string | Buffer} file html data
     * @param {string} host host of server
     * @returns {string} serialized DOM
     */
    addJsonEditor(file, host) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        const script = dom.window.document.createElement("script");
        script.src = `${host}static/modules/white-page-editor/white-page-editor.js`;
        script.classList.add("overlay-script");
        script.defer = true;
        script.type = "module";

        const axiosScript = dom.window.document.createElement("script");
        axiosScript.src = `https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js`;
        axiosScript.classList.add("overlay-script");
        axiosScript.defer = true;

        const styles = [
            "modules/alert/alert.css", "modules/loader/loader.css", "modules/sidebar/sidebar.css",
            "modules/white-page-editor/white-page-editor.css", "overlay/css/style.css"
        ];

        styles.forEach((link) => {
            const style = dom.window.document.createElement("link");
            style.href = `${host}static/${link}`;
            style.rel = "stylesheet";
            style.classList.add("overlay-script");

            dom.window.document.body.append(style);
        });

        dom.window.document.body.append(axiosScript);
        dom.window.document.body.append(script);

        return dom.serialize();
    }

    /**
     * Remove server's scripts and elements from document
     * @param {string | Buffer} file html data 
     * @returns {string} serialized DOM
     */
    removeOverlayElements(file) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        dom.window.document.querySelectorAll(".overlay-script").forEach((el) => {
            el.remove();
        });

        dom.window.document.querySelectorAll(".overlay-element").forEach((el) => {
            el.remove();
        });

        dom.window.document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
            el.removeAttribute("contenteditable");
        });

        dom.window.document.querySelectorAll(".no-unique").forEach((el) => {
            el.classList.remove("no-unique");
        });

        return dom.serialize();
    }

    /**
     * Remove server's elements from document
     * @param {string | Buffer} file html data 
     * @returns {string} serialized DOM 
     */
    clean(file) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        dom.window.document.querySelectorAll(".overlay-element").forEach((el) => {
            el.remove();
        });

        dom.window.document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
            el.removeAttribute("contenteditable");
        });

        return dom.serialize();
    }

    /**
     * Return src attributes content of img from document
     * @param {string | Buffer} file html data 
     * @returns {string[]} Paths of images
     */
    getAllImgPaths(file) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        const images = Array.from(dom.window.document.querySelectorAll("img"));

        return images.map((element) => element.src);
    }

    /**
     * Change specified elements html content
     * @param {string | Buffer} file html data 
     * @param {{ selectors: string[], value: string }} changes Object of element's changes
     * @returns {string} serialized DOM 
     */
    writeElementChanges(file, changes) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        changes.selectors.forEach((selector) => {
           dom.window.document.querySelectorAll(selector).forEach((el) => {
                el.innerHTML = changes.value;
           });
        });

        return dom.serialize();
    }

    /**
     * Return html classes without repeats
     * @param {string | Buffer} html html data 
     * @returns {string[]} Html classes
     */
    getClasses(html) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(html);
        const classes = new Set();

        dom.window.document.querySelectorAll('*').forEach((element) => {
            element.classList.forEach((value) => {
                if (/[a-z A-Z]/.test(value[0])) {
                    classes.add(value);
                }
            });
        });

        const result = [];

        classes.forEach((value) => result.push(value));

        return result;
    }

    /**
     * Change old class of elements to new class
     * @param {string | Buffer} html html data
     * @param {string} oldClass class of elements for changing
     * @param {string} newClass new class for elements
     * @returns {string} serialized DOM
     */
    changeClasses(html, oldClass, newClass) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(html);

        dom.window.document.querySelectorAll(`.${oldClass}`).forEach((element) => {
            element.classList.remove(oldClass);
            element.classList.add(newClass);
        });

        return dom.serialize();
    }
}

export default new DOM();
