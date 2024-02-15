import express from "express";
import routes from "../routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "../middlewares/errorMiddleware.js";
import { eventMiddleware } from "../middlewares/eventMiddleware.js";
class AppController {
  app: express.Application;
  constructor() {
    this.app = express();

    this.beforeMiddlewares();
    this.routes();
    this.afterMiddlewares();
  }

  beforeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors()); // Enable CORS middleware
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(eventMiddleware); 
  }
  afterMiddlewares() {
    this.app.use(errorHandlerMiddleware);
  }

  routes() {
  
    for (const route in routes) {
    
      this.app.use(`/${route === "/" ? "" : route}`, routes[route]);
    }
  }
}

export default new AppController().app; // Create an instance of AppController and export its express instance
