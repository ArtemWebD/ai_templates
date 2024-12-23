import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export default class SiteModel extends Model {
    static associate(models) {
        SiteModel.belongsTo(models.UserModel);
        SiteModel.belongsTo(models.TemplateModel);
    }
}

SiteModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30],
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        templateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "site",
    }
);