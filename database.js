import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import whitePageModel from "./models/whitePage.model.js";
import userModel from "./models/user.model.js";
import tokenModel from "./models/token.model.js";
import templateModel from "./models/template.model.js";
import siteModel from "./models/site.model.js";
import generatedWhitePageModel from "./models/generatedWhitePage.model.js";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URI, { logging: false });

const UserModel = userModel(sequelize);
const TokenModel = tokenModel(sequelize);
const TemplateModel = templateModel(sequelize);
const SiteModel = siteModel(sequelize);
const WhitePageModel = whitePageModel(sequelize);
const GeneratedWhitePageModel = generatedWhitePageModel(sequelize);

UserModel.associate({ UserModel, TokenModel, TemplateModel, SiteModel, GeneratedWhitePageModel });
TokenModel.associate({ UserModel, TokenModel });
TemplateModel.associate({ UserModel, SiteModel });
SiteModel.associate({ UserModel, TemplateModel });
WhitePageModel.associate({ WhitePageModel, GeneratedWhitePageModel });
GeneratedWhitePageModel.associate({ UserModel, WhitePageModel, GeneratedWhitePageModel });

export {
    UserModel, TokenModel, TemplateModel, SiteModel, WhitePageModel, GeneratedWhitePageModel
}
