import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class UserModel extends Model {
        static associate(models) {
            UserModel.hasOne(models.TokenModel, { onDelete: "cascade" });
            UserModel.hasMany(models.TemplateModel, { onDelete: "cascade" });
            UserModel.hasMany(models.SiteModel, { onDelete: "cascade" });
            UserModel.hasMany(models.GeneratedWhitePageModel, { onDelete: "cascade", foreignKey: "userId", as: "generatedWhitePage" });
            UserModel.hasMany(models.GenerateTokenModel, { onDelete: "cascade", foreignKey: "userId", as: "generateTokens" });
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

    return UserModel;
}
