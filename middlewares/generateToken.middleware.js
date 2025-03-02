import ApiError from "../modules/exceptions/api-error.js";
import generateTokenService from "../modules/generateToken/generateToken.service.js";

export default async (req, res, next) => {
    try {
        const token = req.headers["generate-token"];
        console.log(req.headers)
        if (!token) {
            return next(ApiError.BadRequest("Не указан токен генерации"));
        }

        const isVerified = await generateTokenService.verify(token, req.user.id);

        if (!isVerified) {
            return next(ApiError.BadRequest("Указанный токен невалиден"));
        }

        req.generateToken = token;

        next();
    } catch (error) {
        return next(ApiError.BadRequest("Неизвестная ошибка при валидации токена"));
    }
}