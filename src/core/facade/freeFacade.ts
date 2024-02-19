//freeFacade.ts
import keyFacade from "./keyFacade.js";
import FreeService from "../../api/free/freeService.js";
import keyboardFacade from "./keyboardFacade.js";
import config from "../../config/config.js";
/**
 * Facade for interacting with free-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class FreeFacade {
  readonly freService: FreeService;

  /**
   * Constructs a new instance of freeFacade.
   * @param freService The free service to be used.
   */
  constructor(freService: FreeService) {
    this.freService = freService;
  }

  // Add more methods as needed...
}

// Instantiate freeFacade with dependencies
const freeFacade = new FreeFacade(
  new FreeService(
    config.user.free.id,
    keyboardFacade.keyboardService,
    keyFacade.keyService
  )
);

export default freeFacade;
