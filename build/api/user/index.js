import userRoute from "./userRoutes.js";
import UserRepository from "./userRepository.js";
import { db } from "../../db/db.js";
import UserService from "./userService.js";
import UserHandler from "./userHandler.js";
const user = new UserRepository(db());
const userService = new UserService(user);
const userHandler = new UserHandler(userService);
export default userRoute(userHandler);
