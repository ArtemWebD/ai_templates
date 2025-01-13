import Authorirization from "../../modules/authorization/authorization.js";
import Modal from "../../modules/modal/modal.js";
import JsonForm from "./jsonForm.js";
import WhitePageForm from "./white-page-form.js";
import WhitePageList from "./white-page-list.js";

const script = async () => {
    const authorization = new Authorirization();

    const isAdmin = await authorization.checkAdmin();

    if (!isAdmin) {
        window.location.href = "/";
    }

    const whitePageForm = new WhitePageForm();
    const modal = new Modal();
    const jsonForm = new JsonForm();

    const whitePageList = new WhitePageList(jsonForm, modal);

    await whitePageList.getTemplates();
}

script();
