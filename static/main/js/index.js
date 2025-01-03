import TemplateForm from "./templateForm.js";
import Templates from "./templates.js";
import Sites from "./sites.js";
import SiteForm from "./siteForm.js";
import Authorization from "../../modules/authorization/authorization.js";

const authorization = new Authorization();

const checkAuth = async () => {
    const isAuth = await authorization.checkAuthorization();

    if (!isAuth) {
        window.location.href = `http://${window.location.host}/authorization`;
    }
}

checkAuth();

const templates = new Templates();

templates.getTemplates();

const templateForm = new TemplateForm(templates);

const sites = new Sites();

sites.getSites();

const siteForm = new SiteForm(sites);

