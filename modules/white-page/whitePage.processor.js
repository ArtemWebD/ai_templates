import path from "path";
import fs from "fs/promises";
import zip from "../zip/zip.js";
import chatGPT from "../chatGPT/chatGPT.js";
import DOM from "../DOM/DOM.js";
import unifierService from "../unifier/unifier.service.js";

class WhitePageProcessor {
    async generate(job, done) {
        try {
            const { prompt, whitePage, title } = job.data;

            //Copy template's file to site's directory
            const dirName = title;
            const siteRelativePath = "/static/white-page_sites/" + dirName;
            const sourcePath = path.resolve() + whitePage.path;
            const destinationPath = path.resolve() + siteRelativePath;
    
            await fs.cp(sourcePath, destinationPath, { recursive: true });
    
            //Read json file and delete it
            const jsonPath = destinationPath + "/prompt.json";
            const jsonFile = await fs.readFile(jsonPath, { "encoding": "utf8" });
    
            await fs.rm(jsonPath);
    
            const promptArray = JSON.parse(jsonFile);
    
            //Create prompts for chatGPT
            for (const condition of promptArray) {
                //Get response from chatGPT
                const json = JSON.stringify({ prompt: condition.prompt });
                const response = await chatGPT.createWhitePagePrompt(json, prompt);
                const changes = { selectors: condition.selectors, value: JSON.parse(response).value };
    
                //Change html elements and remove server's scripts
                const htmlPath = destinationPath + "/index.html";
                let html = await fs.readFile(htmlPath);
                html = DOM.removeOverlayElements(html);
                html = DOM.writeElementChanges(html, changes);
    
                await fs.writeFile(htmlPath, html);
            }
    
            await unifierService.unifyText(destinationPath);
            await zip.zip(destinationPath, dirName);
    
            done();
        } catch (error) {
            console.log(error);
            done(error);
        }
    }
}

export default new WhitePageProcessor();
