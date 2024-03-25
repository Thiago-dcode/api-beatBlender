//keyFacade.ts
import { db } from "../../db/db.js";
import KeyService from "../../api/key/keyService.js";
import KeyRepository from "../../api/key/keyRepository.js";
import soundFacade from "./soundFacade.js";
import categoryFacade from "./categoryFacade.js";
/**
 * Facade for interacting with KEY-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class KeyFacade {
  /**
   * Constructs a new instance of keyFacade.
   * @param keyService The key service to be used.
   */
  constructor(readonly keyService: KeyService) {}
  // Add more methods as needed...
}

// Instantiate keyFacade with dependencies

let singleton: KeyFacade;

export default () => {
  if (!(singleton instanceof KeyFacade)) {
    singleton = new KeyFacade(
      new KeyService(
        new KeyRepository(db()),
        soundFacade().soundService,
        categoryFacade().categoryService
      )
    );
  }
  return singleton;
};
