import path from "path";
import fs from "fs/promises";
import ApiError from "../exceptions/api-error.js";
import templateService from "../template/template.service.js";
import DOM from "../DOM/DOM.js";
import SiteModel from "../../models/site.model.js";
import SiteDto from "../../dto/site.dto.js";
import zip from "../zip/zip.js";
import imageManager from "../imageManager/imageManager.js";

class SiteService {
    async createSite(templateId, title, host, user) {
        //Check existing of template
        const template = await templateService.findById(templateId);

        if (!template) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        //Copy template's files to site's directory
        const siteRelativePath = "/static/sites/" + title;
        const sourcePath = path.resolve() + template.path;
        const destinationPath = path.resolve() + siteRelativePath;

        await fs.cp(sourcePath, destinationPath, { recursive: true });

        //Including editing scripts and styles
        const destionationHtmlPath = destinationPath + "/index.html";

        const htmlFile = await fs.readFile(destionationHtmlPath);
        const updatedHtml = DOM.addOverlayScripts(htmlFile, host);

        await fs.writeFile(destionationHtmlPath, updatedHtml);

        //Returning site's data
        const site = await SiteModel.create({ path: siteRelativePath, title, templateId, userId: user.id });
        const siteData = new SiteDto(site);

        return siteData;
    }

    async getSites(user) {
        const sites = await SiteModel.findAll({ where: { userId: user.id } });
        const siteDataArray = sites.map((value) => new SiteDto(value));

        return siteDataArray;
    }

    async cleanSite(user, id) {
        const site = await this.getSiteByUserAndId(user, id)

        const sitePath = path.resolve() + site.path;

        const htmlFile = await fs.readFile(sitePath + "/index.html");

        //Remove server scripts and unusable images
        const htmlString = DOM.removeOverlayElements(htmlFile);
        await imageManager.removeUnusableImages(sitePath + "/");

        //Write result
        await fs.writeFile(sitePath + "/index.html", htmlString);
        zip.zip(sitePath, site.title);
        await fs.writeFile(sitePath + "/index.html", htmlFile);

        //Return archive path
        const zipPath = "/static/ready/" + site.title + ".zip";

        return zipPath;
    }

    async deleteSite(user, id) {
        const site = await this.getSiteByUserAndId(user, id);

        const sitePath = path.resolve() + site.path;

        await SiteModel.destroy({ where: { id } });
        await fs.rm(sitePath, { recursive: true, force: true });
    }

    async saveChanges(user, id, html) {
        const site = await this.getSiteByUserAndId(user, id);

        const cleanHtml = DOM.clean(html);

        const siteHtmlPath = path.resolve() + site.path + "/index.html";

        await fs.writeFile(siteHtmlPath, cleanHtml);
    }

    async getSiteByUserAndId(user, id) {
        const site = await SiteModel.findOne({ where: { userId: user.id, id } });

        if (!site) {
            throw ApiError.BadRequest("Указанный сайт не найден");
        }

        return site;
    }
}

export default new SiteService();
