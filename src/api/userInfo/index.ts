import userInfoRoute from "./userInfoRoutes.js";
import userInfoFacade from "../../core/facade/userInfoFacade.js";
import userInfoHandler from "./userInfoHandler.js";

const soundHandler = new userInfoHandler(userInfoFacade().userInfoService);

export default userInfoRoute(soundHandler);
