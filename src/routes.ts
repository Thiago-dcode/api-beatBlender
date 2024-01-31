import logger from "./services/logger/logger.js";
import { Router } from "express";
import userRoutes from "./api/user/index.js";
import  authRoutes from "./api/auth/index.js"
import keyRoutes from "./api/key/routes.js";

const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  logger.daily.info("Accessing home page", { hello: "homepage" });
  res.send("HELLO FROM HOME");
});

const routes: { [key: string]: Router } = {
  "/": homeRouter,
  users: userRoutes,
  auth: authRoutes,
  keys: keyRoutes,
};

export default routes;
