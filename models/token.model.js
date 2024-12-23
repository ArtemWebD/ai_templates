import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export default class TokenModel extends Model {
    static associate(models) {
        TokenModel.belongsTo(models.UserModel);
    }
}

TokenModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "token",
    },
);
