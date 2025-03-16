import express from "express";
import path from "path";
import dotenv from "dotenv";
import { sequelize } from "./database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import { authorizationRouter } from "./modules/routes/authorization-router.js";
import { siteRouter } from "./modules/routes/site-router.js";
import { templateRouter } from "./modules/routes/template-router.js";
import { uniqualizationRouter } from "./modules/routes/uniqualization-router.js";
import { whitePageRouter } from "./modules/routes/white-page-router.js";
import userService from "./modules/user/user.service.js";
import { cleaningQueue } from "./bull.js";
import { generatedWhitePageRouter } from "./modules/routes/generated-white-page-router.js";
import { generateTokenRouter } from "./modules/routes/generate-token-router.js";
import { keywordsRouter } from "./modules/routes/keywords-router.js";

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.HEADER_ORIGIN,
}));

//Static routes
app.use("/static", express.static(path.resolve() + "/static"));

app.use("/modules", express.static(path.resolve() + "/static/modules"));

//Routes
app.use(
    "/api", 
    authorizationRouter, siteRouter, templateRouter, uniqualizationRouter, whitePageRouter, 
    generatedWhitePageRouter, generateTokenRouter, keywordsRouter
);

//Custom middlewares
app.use(errorMiddleware);

//Test connection to database
try {
    await sequelize.authenticate({ logging: false });
    console.log('Connection with database has been established successfully.');
    await sequelize.sync({ force: false, alter: true });

    //Creating super user
    await userService.createSuperUser();
    console.log("Super user has been created successfully.");
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const PORT = process.env.PORT;

//Starting server
app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));

cleaningQueue.add("zip", { lifetime: 15 * 1000 * 60, path: "/static/ready" }, { repeat: { every: 60000 } });
cleaningQueue.add("dir", { lifetime: 15 * 1000 * 60, path: "/static/white-page_sites" }, { repeat: { every: 60000 } });
cleaningQueue.add("db", { lifetime: 15 }, { repeat: { every: 60000 } });
