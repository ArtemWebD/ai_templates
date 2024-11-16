import jsdom from "jsdom";

export default class DOM {
    addOverlayScripts(file, host) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        const script = dom.window.document.createElement("script");
        script.src = `http://${host}/static/overlay/js/script.js`;
        script.classList.add("overlay-script");
        script.defer = true;

        const style = dom.window.document.createElement("link");
        style.href = `http://${host}/static/overlay/css/style.css`;
        style.rel = "stylesheet";
        style.classList.add("overlay-script");

        dom.window.document.body.append(script);
        dom.window.document.body.append(style);

        return dom.serialize();
    }

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

        return dom.serialize();
    }

    getAllImgPaths(file) {
        const { JSDOM } = jsdom;
        const dom = new JSDOM(file);

        const images = Array.from(dom.window.document.querySelectorAll("img"));

        return images.map((element) => element.src);
    }
}