import ApiError from "../modules/exceptions/api-error.js";
import tokenService from "../modules/token/token.service.js";

//Check authorization of user and add user's data in req.user
export default function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(" ")[1];

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}