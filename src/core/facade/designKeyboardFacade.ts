//designKeyboardFacade.ts
import DesignKeyboardService from "../../api/designKeyboard/designKeyboardService.js";
import DesignKeyboardRepository from "../../api/designKeyboard/designKeyboardRepository.js";
import { db } from "../../db/db.js";
import storageFacade from "./services/storageFacade.js";
/**
 * Facade for interacting with designKeyboard-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class DesignKeyboardFacade {
  readonly designKeyboardService: DesignKeyboardService;

  /**
   * Constructs a new instance of designKeyboardFacade.
   * @param designKeyboardService The designKeyboard service to be used.
   */
  constructor(designKeyboardService: DesignKeyboardService) {
    this.designKeyboardService = designKeyboardService;
  }

  // Add more methods as needed...
}

// Instantiate designKeyboardFacade with dependencies
const designKeyboardFacade = new DesignKeyboardFacade(
  new DesignKeyboardService(
    new DesignKeyboardRepository(db())
    ,storageFacade.storageService
  )
);

export default designKeyboardFacade;
