import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import KeyboardHandler from "./keyboardHandler.js";
const router = Router();
export default function keyboardRoutes(handler: KeyboardHandler) {
  router.get("/", verifyToken, handler.index);
  router.get("/:id",verifyToken, handler.show);
  router.post("/", verifyToken, handler.create);
  router.patch("/:id", verifyToken, handler.update);
  router.delete("/:id", verifyToken, handler.destroy);
  return router;
}
