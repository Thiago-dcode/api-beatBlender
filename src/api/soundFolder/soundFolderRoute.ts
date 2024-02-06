import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
import { audioValidationMiddleware } from "../../middlewares/fileValidationMiddleware.js";
import SoundFolderHandler from "./soundFolderHandler.js";
const router = Router();
export default function soundFolderRoute(handler: SoundFolderHandler) {
  router.get("/", verifyToken, handler.index);
  router.post("/", verifyToken, handler.create);
  // router.delete('/:id',verifyToken,handler.destroy)
  return router;
}
