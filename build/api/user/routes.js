import UserHandler from "./handler.js";
import { Router } from "express";
const router = Router();
router.get("/", UserHandler.index);
router.post("/", UserHandler.create);
export default router;
