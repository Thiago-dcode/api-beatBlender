import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
import { audioValidationMiddleware } from "../../middlewares/fileValidationMiddleware.js";
import keyHandler from "./keyHandler.js";
const router = Router();
export default function keyRoutes(handler: keyHandler) {
  router.get("/", verifyToken, handler.index);
  router.get("/:id", verifyToken, handler.show);
  router.post(
    "/",
    uploadMiddleware.memory.single("sound"),
    verifyToken,
    audioValidationMiddleware,
    handler.create
  );
  router.patch(
    "/:id",
    verifyToken,
    uploadMiddleware.memory.single("sound"),
    audioValidationMiddleware,
    handler.update
  );
  router.delete("/:id", verifyToken, handler.destroy);
  return router;
}
