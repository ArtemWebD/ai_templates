import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class GenerateTokenModel extends Model {
        static associate(models) {
            GenerateTokenModel.belongsTo(models.UserModel, { foreignKey: "userId", as: "user" });
        }
    }

    GenerateTokenModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "generateToken",
        }
    );

    return GenerateTokenModel;
}
