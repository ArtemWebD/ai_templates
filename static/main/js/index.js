import Authorization from "../../modules/authorization/authorization.js";
import Modal from "../../modules/modal/modal.js";
import WhitePageForm from "./whitePageForm.js";
import GeneratedWhitePage from "./generatedWhitePage.js";
import ListForm from "../../modules/list-form/listForm.js";
import TemplateAPI from "../../modules/template/template.js";
import FormHandler from "../../modules/form-handler/formHandler.js";
import SiteAPI from "../../modules/site/site.js";
import SelectFiller from "../../modules/select/selectFiller.js";

const start = async () => {
    //Check user auth
    const authorization = new Authorization();
    const isAuth = await authorization.checkAuthorization();

    if (!isAuth) {
        window.location.href = `http://${window.location.host}/authorization`;
    }

    //Templates
    const templatesContainer = document.querySelector("#templates .templates__container");
    const templateAPI = new TemplateAPI();
    const templateListForm = new ListForm(templatesContainer, templateAPI);

    await templateListForm.getAll();
    templateListForm.removeHandler();

    const templateForm = document.getElementById("uploadSiteArchive");

    new FormHandler(templateForm, templateAPI, true, (object) => templateListForm.append(object));

    //Template select
    const templates = await templateAPI.getAll();
    const selectElement = document.getElementById("templateName");
    const selectData = templates.map((template) => {
        return { value: template.id.toString(), text: template.title }
    });
    const selectFiller = new SelectFiller(selectElement);

    selectFiller.fill(selectData);

    //Sites
    const sitesContainer = document.querySelector("#sites .templates__container");
    const siteAPI = new SiteAPI();
    const siteListForm = new ListForm(sitesContainer, siteAPI);

    await siteListForm.getAll();
    siteListForm.removeHandler();

    const siteForm = document.getElementById("createSite");

    new FormHandler(siteForm, siteAPI, false, (object) => siteListForm.append(object));

    new Modal();

    new WhitePageForm();

    new GeneratedWhitePage();
}

start();
