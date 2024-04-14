import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import CategoryHandler from "./categoryHandler";

const router = Router();
export default function designKeyboardRoute(handler: CategoryHandler) {
  router.get("/", verifyToken, handler.index);

  return router;
}
