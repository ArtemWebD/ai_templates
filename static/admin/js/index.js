import Authorirization from "../../modules/authorization/authorization.js";
import FormHandler from "../../modules/form-handler/formHandler.js";
import HiddenElement from "../../modules/hidden-element/hiddenElement.js";
import ListForm from "../../modules/list-form/listForm.js";
import Modal from "../../modules/modal/modal.js";
import UserAPI from "../../modules/user/userAPI.js";
import JsonFiller from "./json-form/jsonFiller.js";
import JsonFormHandler from "./json-form/jsonFormHandler.js";
import UserConverter from "./users/userConverter.js";
import WhitePageAdapter from "./white-page/whitePageAdapter.js";
import WhitePageConverter from "./white-page/whitePageConverter.js";
import GenerateTokenAPI from "../../modules/generate-token/generateTokenAPI.js";
import GenerateTokenFormHandler from "./generate-token/generateTokenFormHandler.js";
import GenerateTokenListForm from "./generate-token/generateTokenListForm.js";
import GenerateTokenConverter from "./generate-token/generateTokenConverter.js";
import CopyElement from "../../modules/copy-element/copyElement.js";
import IncreaseCountAPIAdapter from "./generate-token/increaseCountAPI.js";

const script = async () => {
    //Check auth
    const authorization = new Authorirization();

    const isAdmin = await authorization.checkAdmin();

    if (!isAdmin) {
        window.location.href = "/";
    }

    //Json form
    const whitePageAPI = new WhitePageAdapter();
    const modalId = "jsonModal";
    const jsonForm = document.getElementById("uploadJson");
    const formHandler = new JsonFormHandler(jsonForm, whitePageAPI, () => modal.close(modalId))

    //White page
    const whitePageContainer = document.querySelector(".templates .templates__container");
    const whitePageListForm = new ListForm(whitePageContainer, whitePageAPI, new WhitePageConverter());

    await whitePageListForm.getAll();

    const whitePageForm = document.getElementById("uploadWhitePage");

    new FormHandler(whitePageForm, whitePageAPI, true, (object) => whitePageListForm.append(object));

    //Users
    const usersContainer = document.getElementById("userList");
    const userAPI = new UserAPI();
    const usersListForm = new ListForm(usersContainer, userAPI, new UserConverter());

    await usersListForm.getAll();

    let userId;

    //Generate token
    new HiddenElement();

    const generateTokenForm = document.getElementById("createToken");
    const generateTokenAPI = new GenerateTokenAPI();
    new GenerateTokenFormHandler(generateTokenForm, generateTokenAPI);

    const generateTokenContainer = document.getElementById("generateTokenList");
    const generateTokenFormList = new GenerateTokenListForm(generateTokenContainer, generateTokenAPI, new GenerateTokenConverter());

    const increaseCountForm = document.getElementById("increaseToken");
    const increaseCountAdapter = new IncreaseCountAPIAdapter();

    new FormHandler(increaseCountForm, increaseCountAdapter, false, async () => await generateTokenFormList.getAll(userId));

    const modal = new Modal([
        {
            id: "whitePageTokens",
            callback: async (button) => {
                const id = +button.dataset.userid;
                userId = id;
                await generateTokenFormList.getAll(id);
            }
        },
        {
            id: "jsonModal",
            callback: async (button) => {
                const id = button.dataset.userid;
                const jsonFiller = new JsonFiller(jsonForm, id);

                await jsonFiller.fill();

                formHandler.setId = +id;
            }
        }
    ]);
    new CopyElement();
}

script();
