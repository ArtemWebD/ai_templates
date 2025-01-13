import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export default class UserModel extends Model {
    static associate(models) {
        UserModel.hasOne(models.TokenModel, { onDelete: "cascade" });
        UserModel.hasMany(models.TemplateModel, { onDelete: "cascade" });
        UserModel.hasMany(models.SiteModel, { onDelete: "cascade" });
    }
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [10, 50],
                isEmail: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30],
            },
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user",
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'user',
    }
);
