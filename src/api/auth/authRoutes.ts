import { Router } from "express";
import UserHandler from "./authHandler.js";
const router = Router();
export default function authRoutes(handler: UserHandler) {

  router.post("/login", handler.loggin);


  return router;
}
