import { Router } from "express";
import UserHandler from "./handler.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
const router = Router();

export default function userRoute(handler: UserHandler) {
  router.get("/", handler.index);
  router.post("/", handler.create);
  router.patch("/:username", verifyToken, handler.update);

  return router;
}
