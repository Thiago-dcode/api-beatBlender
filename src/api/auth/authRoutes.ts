import { Router } from "express";
import AuthHandler from "./authHandler.js";
const router = Router();
export default function authRoutes(handler: AuthHandler) {

  router.post("/login", handler.loggin);
  router.post("/refresh-token", handler.refreshToken);


  return router;
}
