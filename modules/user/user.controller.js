import { validationResult } from "express-validator";
import userService from "./user.service.js";
import ApiError from "../exceptions/api-error.js";

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Введены некорректные данные", errors.array()));
            }

            const { email, name, password } = req.body;
            const { tokens } = await userService.registration(email, name, password);

            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Введены некорректные данные", errors.array()));
            }

            const { email, password } = req.body;
            const { tokens } = await userService.login(email, password);

            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { tokens } = await userService.refresh(refreshToken);
            
            res.cookie("refreshToken", tokens.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();