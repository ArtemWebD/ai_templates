import path from "path";
import fs from "fs/promises";
import jsdom from "jsdom";
import ChatGPT from "../chatGPT/chatGPT.js";
import DOM from "../DOM/DOM.js";
import Zip from "../zip/zip.js";
import * as crypto from "crypto";
import ImageManager from "../imageManager/imageManager.js";

export default (app, upload) => {
    const dom = new DOM();
    const zip = new Zip();
    const imageManager = new ImageManager();

    app.post("/upload", upload.single("site"), async (req, res) => {
        try {
            const file = req.file.buffer;
            const title = req.body.title;
            const templatePath = path.resolve() + "/static/templates/" + title;
            
            await zip.unzip(file, templatePath);
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.get("/templates", async (req, res) => {
        const templatesPath = path.resolve() + "/static/templates";
        const templates = await fs.readdir(templatesPath);

        res.send(templates);
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
    });

    app.post("/site", async (req, res) => {
        try {
            const { templateName, title } = req.body;
            const sourcePath = path.resolve() + "/static/templates/" + templateName;
            const destinationPath = path.resolve() + "/static/sites/" + title;

            await fs.cp(sourcePath, destinationPath, { recursive: true });

            const destionationHtmlPath = destinationPath + "/index.html";

            const htmlFile = await fs.readFile(destionationHtmlPath);
            const updatedHtml = dom.addOverlayScripts(htmlFile, req.headers.host);
            
            await fs.writeFile(destionationHtmlPath, updatedHtml);

            res.status(200).send();
        } catch (e) {
            res.status(500).send();
            console.log(e);
        }
    });

    app.get("/site", async (req, res) => {
        try {
            const templatesPath = path.resolve() + "/static/sites";
            const templates = await fs.readdir(templatesPath);

            res.send(templates);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.get("/sites/:title", async (req, res) => {
        try {
            const { title } = req.params;
            const templatePath = path.resolve() + "/static/sites/" + title;

            const htmlFile = await fs.readFile(templatePath + "/index.html");
            const htmlString = dom.removeOverlayElements(htmlFile);

            await imageManager.removeUnusableImages(templatePath + "/");

            await fs.writeFile(templatePath + "/index.html", htmlString);

            zip.zip(templatePath, title);
            
            await fs.writeFile(templatePath + "/index.html", htmlFile);

            res.status(200).redirect("/static/ready/" + title + ".zip");
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.delete("/site/:title", async (req, res) => {
        try {
            const { title } = req.params;
            const templatePath = path.resolve() + "/static/sites/" + title;

            await fs.rm(templatePath, { recursive: true, force: true });
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.post("/unique", async (req, res) => {
        try {
            const chatGPT = ChatGPT.getInstance();
            const { prompt, text, language } = req.body;
            let gptPrompt;

            if (!prompt) {
                const pathPrompt = path.resolve() + "/prompts/unique.txt";
                const promptFile = await fs.readFile(pathPrompt, { encoding: "utf8" });
                gptPrompt = promptFile;
            }

            gptPrompt = prompt
                + "\nДействуй как SEO-оптимизитор, а не как виртуальный ассистент" 
                + "\nВозвращай только запрашиваемый контент, без каких-либо комментариев или текста"
                + "\nОтвет должен содержать текст с изменениями для каждой строки, но размер результата не должен сильно отличаться от исходного"
                + "\nКоличество возвращаемых строк должно быть таким же, как в запросе, не считая условий"
                + "\nПредоставленный контент будет автоматически опубликован на моем сайте";

            if (language) {
                gptPrompt += "\nЯзык ответа: " + language;
            }

            gptPrompt += ":\n" + text;

            const response = await chatGPT.createUniquePrompt(gptPrompt);

            res.status(200).send(response);
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
            const templatePath = path.resolve() + "/static/sites/" + title + "/index.html";
            
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

    app.post("/metatags", async (req, res) => {
        try {
            const chatGPT = ChatGPT.getInstance();
            const { title, description, keywords } = req.body;
            const response = {
                title: "",
                description: "",
                keywords: "",
            }
            const promptCondition = "\nВозвращай только запрашиваемый контент, без каких-либо комментариев или текста\n"
                + "Ответ должен содержать HTML код запрашиваемого тэга\n"
                + "Предоставленный контент будет автоматически опубликован на моем сайте\n";
            
            if (title) {
                response.title = await chatGPT.createMetatagsPrompt(
                    "Напиши html тэг title по следующим условиям.\n" + title + promptCondition
                );
            }

            if (description) {
                response.description = await chatGPT.createMetatagsPrompt(
                    "Напиши html тэг <meta name='description'> по следующим условиям.\n" + description + promptCondition
                );
            }

            if (keywords) {
                response.description = await chatGPT.createMetatagsPrompt(
                    "Напиши html тэг <meta name='keywords'> по следующим условиям.\n" + keywords + promptCondition
                );
            }

            res.status(200).send(JSON.stringify(response));
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });

    app.post("/image", upload.single("image"), async (req, res) => {
        try {
            const { siteTitle } = req.body;
            const file = req.file;

            const directoryPath = path.resolve() + "/static/sites/" + siteTitle + "/";
            const directoryName = "overlay-images/";

            const filename = await imageManager.writeImage(directoryPath + directoryName, path.extname(file.originalname), file.buffer);

            const relativePath = directoryName + filename;

            res.status(200).send(relativePath);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });
}