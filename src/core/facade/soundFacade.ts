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
class SoundFacade {
  readonly soundService: SoundService;

  /**
   * Constructs a new instance of SoundFacade.
   * @param soundService The user service to be used.
   */
  constructor(soundService: SoundService) {
    this.soundService = soundService;
  }

  // Add more methods as needed...
}

// Instantiate SoundFacade with dependencies
const soundFacade = new SoundFacade(
  new SoundService(
    new SoundRepository(db()),
    storageFacade.storageService,
    soundFolderFacade.soundFolderService,
    membershipStatusFacade.membershipStatusService
  )
);

export default soundFacade;
