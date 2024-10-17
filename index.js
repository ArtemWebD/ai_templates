import express from "express";
import path from "path";
import routes from "./modules/routes/routes.js";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer();

app.use(express.json());

app.use("/static", express.static(path.resolve() + "/static"));
app.use("/", express.static(path.resolve() + "/static/main"));

routes(app, upload);

app.listen(3000, () => console.log("Server has been started on port 3000"));