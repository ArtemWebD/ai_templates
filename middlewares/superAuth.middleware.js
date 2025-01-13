import ApiError from "../modules/exceptions/api-error.js";

//Check authorization by superuser
export default function(req, res, next) {
    try {
        if (req.user.type !== "super") {
            return next(ApiError.ForbiddenError());
        }

        next();
    } catch (error) {
        return next(ApiError.ForbiddenError());
    }
}