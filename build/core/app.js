import express from "express";
import routes from "../routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js";
class AppController {
    constructor() {
        this.app = express(); // Use the imported 'express' module directly
        this.beforeMiddlewares();
        this.routes();
        this.afterMiddlewares();
    }
    beforeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors()); // Enable CORS middleware
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }
    afterMiddlewares() {
        this.app.use(errorHandlerMiddleware);
    }
    routes() {
        for (const route in routes) {
            console.log(`/${route === "/" ? "" : route}`);
            this.app.use(`/${route === "/" ? "" : route}`, routes[route]);
        }
    }
}
export default new AppController().app; // Create an instance of AppController and export its express instance
