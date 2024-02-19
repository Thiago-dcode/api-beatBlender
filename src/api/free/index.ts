import FreeHandler from "./freeHandler.js";
import freeRoutes from "./freeRoutes.js";
import freeFacade from "../../core/facade/freeFacade.js";
const keyboardHnadler = new FreeHandler(freeFacade.freService);
export default freeRoutes(keyboardHnadler);
