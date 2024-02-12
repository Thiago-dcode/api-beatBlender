//soundFolderFacade.ts
import SoundFolderRepository from "../../api/soundFolder/soundFolderRepository.js";
import { db } from "../../db/db.js";
import SoundFolderService from "../../api/soundFolder/soundFolderService.js";
import storageFacade from "./services/storageFacade.js";

/**
 * Facade for interacting with sound-related functionality.
 * Provides a simplified interface for accessing sound services.
 */
class SoundFolderFacade {
  readonly soundFolderService: SoundFolderService;

  /**
   * Constructs a new instance of SoundFolderFacade.
   * @param soundFolderService The user service to be used.
   */
  constructor(soundFolderService: SoundFolderService) {
    this.soundFolderService = soundFolderService;
  }

  // Add more methods as needed...
}

// Instantiate SoundFolderFacade with dependencies
const soundFolderFacade = new SoundFolderFacade(
  new SoundFolderService(
    new SoundFolderRepository(db()),
    storageFacade.storageService
  )
);

export default soundFolderFacade;