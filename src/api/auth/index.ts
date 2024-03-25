import authRoutes from "./authRoutes.js";
import authFacade from "../../core/facade/authFacade.js";
import AuthHandler from "./authHandler.js";

const authHandler = new AuthHandler(authFacade().authService);

export default authRoutes(authHandler);
