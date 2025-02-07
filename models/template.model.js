import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class TemplateModel extends Model {
        static associate(models) {
            TemplateModel.belongsTo(models.UserModel);
            TemplateModel.hasMany(models.SiteModel, { onDelete: "cascade" });
        }
    }

    TemplateModel.init(
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
        },
        {
            sequelize,
            modelName: "template",
        }
    );

    return TemplateModel;
}