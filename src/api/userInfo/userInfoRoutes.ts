import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";

import userInfoHandler from "./userInfoHandler.js";
const router = Router();
export default function userInfoRoute(handler: userInfoHandler) {
  router.get("/:id", verifyToken, handler.show);

  return router;
}
