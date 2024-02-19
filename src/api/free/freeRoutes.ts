import { Router } from "express";
import FreeHandler from "./freeHandler.js";
const router = Router();
export default function freeRoutes(handler: FreeHandler) {
  router.get("/keyboards", handler.allKeyboards);
  router.get("/keyboards/:id", handler.oneKeyboard);

  return router;
}
