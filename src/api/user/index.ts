import userRoute from "./userRoutes.js";
import UserHandler from "./userHandler.js";
import userFacade from "../../core/facade/userFacade.js";
const userHandler = new UserHandler(userFacade().userService);
export default userRoute(userHandler);
