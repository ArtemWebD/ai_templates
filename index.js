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

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

//Static routes
app.use("/static", express.static(path.resolve() + "/static"));
app.use("/modules", express.static(path.resolve() + "/static/modules"));
app.use("/", express.static(path.resolve() + "/static/main"));
app.use("/authorization", express.static(path.resolve() + "/static/authorization"));

//Routes
app.use("/api", authorizationRouter, siteRouter, templateRouter, uniqualizationRouter);

//Custom middlewares
app.use(errorMiddleware);

//Test connection to database
try {
    await sequelize.authenticate({ logging: false });
    console.log('Connection with database has been established successfully.');
    await sequelize.sync({ force: false, alter: true });
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const PORT = process.env.PORT;

//Starting server
app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));