import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";

import SoundFolderHandler from "./soundFolderHandler.js";
const router = Router();
export default function soundFolderRoute(handler: SoundFolderHandler) {
  router.get("/", verifyToken, handler.index);
  router.post("/", verifyToken, handler.create);
  router.get("/:id", verifyToken, handler.show);
  router.patch("/:id", verifyToken, handler.update);
  router.delete("/:id", verifyToken, handler.destroy);
  return router;

}