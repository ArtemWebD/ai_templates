import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export default class WhitePageModel extends Model {}

WhitePageModel.init(
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
    },
    {
        sequelize,
        modelName: "whitePage",
    }
);