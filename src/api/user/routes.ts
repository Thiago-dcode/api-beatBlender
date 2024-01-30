import { Router } from "express";
import UserHandler from "./handler.js";
import UserService from "./userService.js";
const router = Router();
export default function userRoute(handler: UserHandler) {
  if (handler.userService && handler.userService instanceof UserService) {
    console.log("--USERSERVICE route--");
  } else {
    console.log("--NOT USERSERVICE route--");
  }
  router.get("/", handler.index);
  router.post("/", handler.create);
  router.patch("/:username", handler.update);

  return router;
}
