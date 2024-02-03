import { Router } from "express";
import UserHandler from "./userHandler.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
import { imageValidationMiddleware } from "../../middlewares/fileValidationMiddleware.js";
const router = Router();

export default function userRoute(handler: UserHandler) {
  router.get("/", handler.index);
  router.get("/:username", handler.show);
  router.post("/", uploadMiddleware.memory.single("avatar"), handler.create);
  router.patch(
    "/:username",
    verifyToken,
    uploadMiddleware.memory.single("avatar"),
    imageValidationMiddleware,
    handler.update
  );
  router.delete("/:username", verifyToken, handler.delete);

  return router;
}
