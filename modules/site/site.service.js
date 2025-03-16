import path from "path";
import fs from "fs/promises";
import ApiError from "../exceptions/api-error.js";
import templateService from "../template/template.service.js";
import DOM from "../DOM/DOM.js";
import { SiteModel, TemplateModel } from "../../database.js";
import SiteDto from "../../dto/site.dto.js";
import zip from "../zip/zip.js";
import imageManager from "../imageManager/imageManager.js";

class SiteService {
    /**
     * 
     * @param {number} templateId template's id
     * @param {string} title site's title
     * @param {UserDto} user user's object
     * @returns {Promise<SiteDto>} site's object
     */
    async createSite(templateId, title, user) {
        //Check existing of template
        const template = await templateService.findById(templateId);

        if (!template) {
            throw ApiError.BadRequest("Указанный шаблон не найден");
        }

        //Copy template's files to site's directory
        const siteRelativePath = "/static/sites/" + title;
        const sourcePath = path.resolve() + template.path;
        const destinationPath = path.join(path.resolve(), siteRelativePath);

        await fs.cp(sourcePath, destinationPath, { recursive: true });

        //Including editing scripts and styles
        await this._addOverlayScripts(destinationPath, template.pages);

        //Returning site's data
        let site = await SiteModel.create(
            { path: siteRelativePath, title, templateId, userId: user.id },
        );
        
        site = await this.getSiteByUserAndId(user, site.id);

        return new SiteDto(site);
    }

    /**
     * 
     * @param {UserDto} user user's object
     * @returns {Promise<SiteDto[]>} found sites
     */
    async getSites(user) {
        const sites = await SiteModel.findAll({
            where: { userId: user.id },
            include: {
                as: "template",
                model: TemplateModel,
                attributes: ["pages"],
            }
        });
        const siteDataArray = sites.map((value) => new SiteDto(value));

        return siteDataArray;
    }

    /**
     * Clear site from unusable images and server's script and zip it
     * @param {UserDto} user user's object
     * @param {number} id site's id
     * @returns {Promise<string>} site's archive path
     */
    async cleanSite(user, id) {
        const site = await this.getSiteByUserAndId(user, id)

        const sitePath = path.join(path.resolve(), site.path);

        for (const page of site.template.pages) {
            const filePath = path.join(sitePath, page);
            const htmlFile = await fs.readFile(filePath);

            //Remove server scripts
            const htmlString = DOM.removeOverlayElements(htmlFile);

            //Write result
            await fs.writeFile(filePath, htmlString);
        }

        await imageManager.removeUnusableImages(sitePath + "/");

        zip.zip(sitePath, site.title);
        
        await this._addOverlayScripts(sitePath, site.template.pages);

        //Return archive path
        const zipPath = "/static/ready/" + site.title + ".zip";

        return zipPath;
    }

    /**
     * 
     * @param {UserDto} user user's object
     * @param {number} id site's id
     * @returns {Promise<void>}
     */
    async deleteSite(user, id) {
        const site = await this.getSiteByUserAndId(user, id);

        const sitePath = path.resolve() + site.path;

        await SiteModel.destroy({ where: { id } });
        await fs.rm(sitePath, { recursive: true, force: true });
    }

    /**
     * Update site's html
     * @param {UserDto} user user's object
     * @param {number} id site's id
     * @param {string} html updated html
     * @param {string} page page for updating
     * @returns {Promise<void>}
     */
    async saveChanges(user, id, html, page) {
        const site = await this.getSiteByUserAndId(user, id);

        const cleanHtml = DOM.clean(html);

        const siteHtmlPath = path.join(path.resolve(), site.path, page);

        await fs.writeFile(siteHtmlPath, cleanHtml);
    }

    /**
     * 
     * @param {UserDto} user user's object
     * @param {number} id site's id
     * @returns {Promise<SiteModel>} record from database
     */
    async getSiteByUserAndId(user, id) {
        const site = await SiteModel.findOne({
            where: { userId: user.id, id },
            include: {
                as: "template",
                model: TemplateModel,
                attributes: ["pages"],
            },
        });

        if (!site) {
            throw ApiError.BadRequest("Указанный сайт не найден");
        }

        return site;
    }

    /**
     * @param {string} directory directory of site
     * @param {string[]} pages pages of site
     */
    async _addOverlayScripts(directory, pages) {
        for (const page of pages) {
            const destionationHtmlPath = path.join(directory, page);

            const htmlFile = await fs.readFile(destionationHtmlPath);
            const updatedHtml = DOM.addOverlayScripts(htmlFile, process.env.CLIENT_URL);

            await fs.writeFile(destionationHtmlPath, updatedHtml);
        }
    }
}

export default new SiteService();
