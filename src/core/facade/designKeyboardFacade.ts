//designKeyboardFacade.ts
import DesignKeyboardService from "../../api/designKeyboard/designKeyboardService.js";
import DesignKeyboardRepository from "../../api/designKeyboard/designKeyboardRepository.js";
import { db } from "../../db/db.js";
import initStorageFacade from "./services/storageFacade.js";
/**
 * Facade for interacting with designKeyboard-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
const storageFacade = initStorageFacade();
class DesignKeyboardFacade {
  /**
   * Constructs a new instance of designKeyboardFacade.
   * @param designKeyboardService The designKeyboard service to be used.
   */
  constructor(readonly designKeyboardService: DesignKeyboardService) {}
  // Add more methods as needed...
}

// Instantiate designKeyboardFacade with dependencies
let singleton: DesignKeyboardFacade;

export default () => {
  if (!(singleton instanceof DesignKeyboardFacade)) {
    singleton = new DesignKeyboardFacade(
      new DesignKeyboardService(
        new DesignKeyboardRepository(db()),
        storageFacade.storageService
      )
    );
  }
  return singleton;
};
