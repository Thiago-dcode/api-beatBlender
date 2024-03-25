import FreeHandler from "./freeHandler.js";
import freeRoutes from "./freeRoutes.js";
import freeFacade from "../../core/facade/freeFacade.js";
const freeHandler = new FreeHandler(freeFacade().freeService);
export default freeRoutes(freeHandler);
