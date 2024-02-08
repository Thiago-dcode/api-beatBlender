import { Router } from "express";
import SoundHandler from "./soundHandler.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
import { audioValidationMiddleware } from "../../middlewares/fileValidationMiddleware.js";
const router = Router();
export default function soundRoutes(handler: SoundHandler) {
  router.get("/", verifyToken, handler.index);
  router.get("/:id", verifyToken, handler.show);
  router.post(
    "/",
    uploadMiddleware.memory.array("sounds"),
    verifyToken,
    audioValidationMiddleware,
    handler.create
  );
  router.patch(
    "/:id",
    verifyToken,
    uploadMiddleware.memory.single("sound"),
    handler.update
  );
  router.delete("/:id", verifyToken, handler.destroy);
  return router;
}
