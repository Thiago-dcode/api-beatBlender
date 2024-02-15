import KeyboardHandler from "./keyboardHandler.js";
import keyboardFacade from "../../core/facade/keyboardFacade.js";
import keyboardRoutes from "./keyboardRoutes.js";
const keyboardHnadler = new KeyboardHandler(keyboardFacade.keyboardService);
export default keyboardRoutes(keyboardHnadler);
