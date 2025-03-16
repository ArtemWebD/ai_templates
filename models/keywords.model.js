import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class KeywordsModel extends Model {
        static associate(models) {
            KeywordsModel.belongsTo(models.TemplateModel, { as: "template" });
        }
    }

    KeywordsModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            words: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: []
            },
            selector: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 60],
                },
            },
            page: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            templateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "keywords",
        }
    );

    return KeywordsModel;
}
