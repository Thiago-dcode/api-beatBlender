//keyboardFacade.ts
import { db } from "../../db/db.js";
import KeyBoardService from "../../api/keyboard/keyboardService.js";
import KeyboardRepository from "../../api/keyboard/keyboardRepository.js";
import keyFacade from "./keyFacade.js";
import membershipStatusFacade from "./membershipStatusFacade.js";
import designKeyboardFacade from "./designKeyboardFacade.js";
/**
 * Facade for interacting with keyboard-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class KeyboardFacade {
  readonly keyboardService: KeyBoardService;

  /**
   * Constructs a new instance of keyboardFacade.
   * @param keyboardService The keyboard service to be used.
   */
  constructor(keyboardService: KeyBoardService) {
    this.keyboardService = keyboardService;
  }

  // Add more methods as needed...
}

// Instantiate keyboardFacade with dependencies
const keyboardFacade = new KeyboardFacade(
  new KeyBoardService(
    new KeyboardRepository(db()),
    keyFacade.keyService,
    membershipStatusFacade.membershipStatusService,
    designKeyboardFacade.designKeyboardService
  )
);

export default keyboardFacade;
