import keyRoutes from "./keyRoutes.js";
import keyFacade from "../../core/facade/keyFacade.js";
import KeyHandler from "./keyHandler.js";
const keyHandler = new KeyHandler(keyFacade.keyService);
export default keyRoutes(keyHandler);
