import jwt from "jsonwebtoken";
import TokenModel from "../../models/token.model.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { userId } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        console.log(userId)
        return TokenModel.create({ userId, refreshToken });
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

export default new TokenService();