import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import tokenService from "../token/token.service.js";
import UserDto from "../../dto/user.dto.js";
import ApiError from "../exceptions/api-error.js";

class UserService {
    async registration(email, name, password) {
        const candidateEmail = await UserModel.findOne({ where: { email } });

        if (candidateEmail) {
            throw ApiError.BadRequest("Пользователь с такой почтой уже существует");
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({ email, name, password: hashPassword });
        
        return this.__createResponseBody(user);
    }

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
