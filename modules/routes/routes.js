import path from "path";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import jsdom from "jsdom";
import ChatGPT from "../chatGPT/chatGPT.js";
import DOM from "../DOM/DOM.js";

export default (app, upload) => {
    const dom = new DOM();

    app.post("/upload", upload.single("site"), async (req, res) => {
        try {            
            const file = req.file.buffer;
            const zip = new AdmZip(file);
            const title = req.body.title;
            const templatePath = path.resolve() + "/static/templates/" + title;
            
            await zip.extractAllToAsync(templatePath);

            const htmlFile = await fs.readFile(templatePath + "/index.html");
            const updatedHtml = dom.addOverlayScripts(htmlFile, req.headers.host);
            
            await fs.writeFile(templatePath + "/index.html", updatedHtml);

            res.status(200).send();
        } catch (e) {
            res.status(500).send();
            console.log(e);
        }
    });

    app.get("/templates", async (req, res) => {
        const templatesPath = path.resolve() + "/static/templates";
        const templates = await fs.readdir(templatesPath);

        res.send(templates);
    });

    app.post("/unique", async (req, res) => {
        try {
            const chatGPT = ChatGPT.getInstance();
            let prompt;

            if (!req.body.prompt) {
                const pathPrompt = path.resolve() + "/prompts/unique.txt";
                const promptFile = await fs.readFile(pathPrompt, { encoding: "utf8" });
                prompt = promptFile + req.body.text;
            } else {
                prompt = req.body.prompt 
                    + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев или текста\n"
                    + "\nОтвет должен содержать HTML код исходного блока с изменениями\n"
                    + "\nПредоставленный контент будет автоматически опубликован на моем сайте\n"
                    + req.body.text;
            }

            const response = await chatGPT.createPrompt(prompt);

            const { JSDOM } = jsdom;
            const dom = new JSDOM(response);
            let serialized = "";

            for (let i = 0; i < dom.window.document.body.children.length; i++) {
                serialized += dom.window.document.body.children.item(i).innerHTML;
            }

            res.status(200).send(serialized);
        } catch (error) {
            console.log(error);
            res.status(500).send("Error connection with AI");
        }
    });

    app.get("/unique", async (req, res) => {
        try {
            const pathPrompt = path.resolve() + "/prompts/unique.txt";
            const promptFile = await fs.readFile(pathPrompt, { encoding: "utf8" });
            res.status(200).send(promptFile);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.post("/save", async (req, res) => {
        try {
            const { title, html } = req.body;
            const templatePath = path.resolve() + "/static/templates/" + title + "/index.html";
            
            const { JSDOM } = jsdom;
            const dom = new JSDOM(html);

            dom.window.document.querySelectorAll(".overlay-element").forEach((el) => {
                el.remove();
            });

            dom.window.document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
                el.removeAttribute("contenteditable");
            });

            const htmlString = dom.serialize();

            await fs.writeFile(templatePath, htmlString);

            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.get("/templates/:title", async (req, res) => {
        try {
            const { title } = req.params;
            const templatePath = path.resolve() + "/static/templates/" + title;

            const htmlFile = await fs.readFile(templatePath + "/index.html");
            const htmlString = dom.removeOverlayElements(htmlFile);

            await fs.writeFile(templatePath + "/index.html", htmlString);

            const zip = new AdmZip();

            await zip.addLocalFolder(templatePath);
            
            const readyPath = path.resolve() + "/static/ready/" + title + ".zip";

            zip.writeZip(readyPath);
            
            await fs.writeFile(templatePath + "/index.html", htmlFile);

            res.status(200).redirect("/static/ready/" + title + ".zip");
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.delete("/templates/:title", async (req, res) => {
        try {
            const { title } = req.params;
            const templatePath = path.resolve() + "/static/templates/" + title;

            await fs.rm(templatePath, { recursive: true, force: true });
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    })
}