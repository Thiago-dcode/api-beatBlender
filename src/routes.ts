import { Router } from "express";
import userRoutes from "./api/user/index.js";
import authRoutes from "./api/auth/index.js";
import keyRoutes from "./api/key/index.js";
import soundRoutes from "./api/sound/index.js";
import soundFolderRoutes from "./api/soundFolder/index.js";
import userInfoRoute from "./api/userInfo/index.js";
import keyboardRoutes from "./api/keyboard/index.js";
import designKeyboards from "./api/designKeyboard/index.js";
import freeRoutes from "./api/free/index.js";
import categoryRoutes from "./api/category/index.js";
const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  res.send("HOME");
});

const routes: { [key: string]: Router } = {
  "/": homeRouter,
  users: userRoutes,
  auth: authRoutes,
  sounds: soundRoutes,
  ["sounds-folder"]: soundFolderRoutes,
  keys: keyRoutes,
  keyboards: keyboardRoutes,
  ["user-info"]: userInfoRoute,
  free: freeRoutes,
  ["design-keyboard"]: designKeyboards,
  ["categories"]: categoryRoutes,
};

export default routes;
