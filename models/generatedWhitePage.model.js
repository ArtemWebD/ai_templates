import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class GeneratedWhitePageModel extends Model {
        static associate(models) {
            GeneratedWhitePageModel.belongsTo(models.WhitePageModel, { foreignKey: "whitePageId", as: "whitePage" });
            GeneratedWhitePageModel.belongsTo(models.UserModel, { foreignKey: "userId", as: "users" });
        }
    }

    GeneratedWhitePageModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            jobId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            whitePageId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                foreignKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                foreignKey: true,
            },
        },
        {
            sequelize,
            modelName: "generatedWhitePage",
        }
    );

    return GeneratedWhitePageModel;
}