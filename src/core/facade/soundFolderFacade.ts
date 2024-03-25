//soundFolderFacade.ts
import SoundFolderRepository from "../../api/soundFolder/soundFolderRepository.js";
import { db } from "../../db/db.js";
import SoundFolderService from "../../api/soundFolder/soundFolderService.js";
import storageFacade from "./services/storageFacade.js";

/**
 * Facade for interacting with sound-related functionality.
 * Provides a simplified interface for accessing sound services.
 */
console.log("SOUND FOLDER FACADE");
class SoundFolderFacade {
  /**
   * Constructs a new instance of SoundFolderFacade.
   * @param soundFolderService The user service to be used.
   */

  constructor(readonly soundFolderService: SoundFolderService) {}

  // Add more methods as needed...
}

// Instantiate SoundFolderFacade with dependencies

let singleton: SoundFolderFacade;

export default () => {
  if (!(singleton instanceof SoundFolderFacade)) {
    singleton = new SoundFolderFacade(
      new SoundFolderService(
        new SoundFolderRepository(db()),
        storageFacade().storageService
      )
    );
  }
  return singleton;
};
