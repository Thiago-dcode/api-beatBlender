import { Router } from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
const router = Router();
export default function userRoute(handler) {
    router.get("/", handler.index);
    router.post("/", handler.create);
    router.patch("/:username", verifyToken, handler.update);
    return router;
}
