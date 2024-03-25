//soundFacade.ts
import SoundRepository from "../../api/sound/soundRepository.js";
import { db } from "../../db/db.js";
import SoundService from "../../api/sound/soundService.js";
import soundFolderFacade from "./soundFolderFacade.js";
import membershipStatusFacade from "./membershipStatusFacade.js";
import storageFacade from "./services/storageFacade.js";
/**
 * Facade for interacting with sound-related functionality.
 * Provides a simplified interface for accessing sound services.
 */
console.log("SOUND FACADE");
class SoundFacade {
  /**
   * Constructs a new instance of SoundFacade.
   * @param soundService The sound service to be used.
   */

  constructor(readonly soundService: SoundService) {}

  // Add more methods as needed...
}

// Instantiate SoundFacade with dependencies

let singleton: SoundFacade;

export default () => {
  if (!(singleton instanceof SoundFacade)) {
    singleton = new SoundFacade(
      new SoundService(
        new SoundRepository(db()),
        storageFacade().storageService,
        soundFolderFacade().soundFolderService,
        membershipStatusFacade().membershipStatusService
      )
    );
  }
  return singleton;
};
