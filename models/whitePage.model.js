import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class WhitePageModel extends Model {
        static associate(models) {
            WhitePageModel.hasMany(models.GeneratedWhitePageModel, { foreignKey: "whitePageId", as: "generatedWhitePage" });
        }
    }

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

    return WhitePageModel;
}