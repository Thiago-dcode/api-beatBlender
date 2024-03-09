import { Router } from "express";
import DesignKeyboardHandler from "./designKeyboardHandler";
import { verifyToken } from "../../middlewares/authMiddleware.js";
const router = Router();
export default function designKeyboardRoute(handler: DesignKeyboardHandler) {
  router.get("/", verifyToken, handler.index);

  return router;
}
