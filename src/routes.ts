import logger from "./services/logger/logger.js";
import { Router } from "express";
import userRoutes from "./api/user/index.js";
import authRoutes from "./api/auth/index.js";
import keyRoutes from "./api/key/routes.js";
import soundRoutes from "./api/sound/index.js";
import soundFolder from "./api/soundFolder/index.js";
import userInfoRoute from "./api/userInfo/index.js";

const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  logger.daily.info("Accessing home page", { hello: "homepage" });
  res.send("HOME");
});

const routes: { [key: string]: Router } = {
  "/": homeRouter,
  users: userRoutes,
  auth: authRoutes,
  sounds: soundRoutes,
  ["sounds-folder"]: soundFolder,
  keys: keyRoutes,
  ["user-info"]: userInfoRoute,
};

export default routes;
