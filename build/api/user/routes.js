import { Router } from "express";
import UserHandler from "./handler.js";
const router = Router();
export default function userRoute() {
    router.get("/", UserHandler.index);
    router.post("/", UserHandler.create);
    return router;
}
