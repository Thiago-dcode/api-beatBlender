//freeFacade.ts
import keyFacade from "./keyFacade.js";
import FreeService from "../../api/free/freeService.js";
import keyboardFacade from "./keyboardFacade.js";
import config from "../../config/config.js";
import userFacade from "./userFacade.js";
/**
 * Facade for interacting with free-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class FreeFacade {
  constructor(readonly freeService: FreeService) {}
}

// Instantiate freeFacade with dependencies

let singleton: FreeFacade;

export default () => {
  if (!(singleton instanceof FreeFacade)) {
    singleton = new FreeFacade(
      new FreeService(
        userFacade().userService,
        keyboardFacade().keyboardService,
        keyFacade().keyService
      )
    );
  }
  return singleton;
};
