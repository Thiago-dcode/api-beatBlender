import express from "express";
import routes from "../routes.js";
// import cors from 'cors'
class AppController {
    constructor() {
        this.app = express(); // Use the imported 'express' module directly
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
        // this.app.use(cors()); // Enable CORS middleware
        // this.app.use(bodyParser.json());
    }
    routes() {
        const router = express.Router();
        for (const route in routes) {
            console.log(`/${route === "/" ? "" : route}`);
            this.app.use(`/${route === "/" ? "" : route}`, routes[route]);
        }
    }
}
export default new AppController().app; // Create an instance of AppController and export its express instance
