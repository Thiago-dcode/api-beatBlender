//keyFacade.ts
import { db } from "../../db/db.js";
import KeyService from "../../api/key/keyService.js";
import KeyRepository from "../../api/key/keyRepository.js";
import soundFacade from "./soundFacade.js";
/**
 * Facade for interacting with KEY-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class KeyFacade {
  readonly keyService: KeyService;

  /**
   * Constructs a new instance of keyFacade.
   * @param keyService The key service to be used.
   */
  constructor(keyService: KeyService) {
    this.keyService = keyService;
  }

  // Add more methods as needed...
}

// Instantiate keyFacade with dependencies
const keyFacade = new KeyFacade(
  new KeyService(new KeyRepository(db()), soundFacade.soundService)
);

export default keyFacade;
