import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class TokenModel extends Model {
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

    return TokenModel;
}
