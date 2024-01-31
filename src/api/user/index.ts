import userRoute from "./routes.js";
import UserRepository from "./repository.js";
import { db } from "../../db/db.js";
import UserService from "./userService.js";
import UserHandler from "./handler.js";

const user = new UserRepository(db());
const userService = new UserService(user);
const userHandler = new UserHandler(userService);
export default userRoute(userHandler);
