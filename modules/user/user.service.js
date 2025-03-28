import { GenerateTokenModel, UserModel } from "../../database.js";
import bcrypt from "bcrypt";
import tokenService from "../token/token.service.js";
import UserDto from "../../dto/user.dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
    /**
     * 
     * @param {string} email user's email
     * @param {string} name username
     * @param {string} password user's password
     * @returns {Promise<{ tokens: { accessToken: string, refreshToken: string }, user: UserDto }>}
     */
    async registration(email, name, password) {
        const candidateEmail = await UserModel.findOne({ where: { email } });

        if (candidateEmail) {
            throw ApiError.BadRequest("Пользователь с такой почтой уже существует");
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({ email, name, password: hashPassword });
        
        return this.__createResponseBody(user);
    }

    /**
     * 
     * @param {string} email user's email
     * @param {string} password user's password
     * @returns {Promise<{ tokens: { accessToken: string, refreshToken: string }, user: UserDto }>}
     */
    async login(email, password) {
        const user = await UserModel.findOne({ where: { email } });
        
        if (!user) {
            throw ApiError.BadRequest("Пользователь с таким почтовым адресом не найден");
        }

        const isPasswordEquals = await bcrypt.compare(password, user.password);

        if (!isPasswordEquals) {
            throw ApiError.BadRequest("Неверный пароль");
        }

        return this.__createResponseBody(user);
    }

    /**
     * 
     * @param {string} refreshToken user's refresh token
     * @returns {Promise<{ tokens: { accessToken: string, refreshToken: string }, user: UserDto }>}
     */
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDatabase = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDatabase) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findOne({ where: { id: userData.id } });

        return this.__createResponseBody(user);
    }

    /**
     * 
     * @returns {Promise<void>}
     */
    async createSuperUser() {
        const candidateEmail = await UserModel.findOne({ where: { email: process.env.SUPER_USER_EMAIL } });

        if (candidateEmail) {
            return;
        }
        
        const hashPassword = await bcrypt.hash(process.env.SUPER_USER_PASSWORD, 3);

        await UserModel.create({ 
            email: process.env.SUPER_USER_EMAIL,
            name: process.env.SUPER_USER_NAME,
            password: hashPassword,
            type: "super",
        });
    }

    /**
     * @returns {Promise<UserDto[]>}
     */
    async getAll() {
        const users = await UserModel.findAll({
            include: [{
                model: GenerateTokenModel,
                as: "generateTokens",
                attributes: ["id", "token", "count", "createdAt"]
            }]
        });

        return users.map((user) => new UserDto(user));
    }

    async __createResponseBody(user) {
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            tokens,
            user: userDto,
        }
    }
}

export default new UserService();
