import jwt from "jsonwebtoken";
import { TokenModel } from "../../database.js";

/**
 * Module for token management
 */
class TokenService {
    /**
     * Generate pair of tokens
     * @param {any} payload token's payload data
     * @returns {{ accessToken: string, refreshToken: string }}
     */
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

        return { accessToken, refreshToken };
    }

    /**
     * Save refresh token
     * @param {number} userId user's id
     * @param {string} refreshToken user's refresh token
     * @returns {Promise<TokenModel>}
     */
    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { userId } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return TokenModel.create({ userId, refreshToken });
    }

    /**
     * 
     * @param {string} token user's access token
     * @returns {Promise<UserDto | null>}
     */
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    /**
     * 
     * @param {string} token user's refresh token
     * @returns {Promise<UserDto | null>}
     */
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    /**
     * 
     * @param {string} refreshToken user's refresh token
     * @returns {Promise<TokenModel>}
     */
    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

export default new TokenService();