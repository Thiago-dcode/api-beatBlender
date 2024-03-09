import designKeyboardRoute from "./designKeyboardRoute.js";
import designKeyboardFacade from "../../core/facade/designKeyboardFacade.js";
import DesignKeyboardHandler from "./designKeyboardHandler.js";

export default designKeyboardRoute(
  new DesignKeyboardHandler(designKeyboardFacade.designKeyboardService)
);
