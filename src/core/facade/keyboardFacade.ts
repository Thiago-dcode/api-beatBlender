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
  constructor(readonly keyboardService: KeyBoardService) {}

  // Add more methods as needed...
}

// Instantiate keyboardFacade with dependencies

let singleton: KeyboardFacade;

export default () => {
  if (!(singleton instanceof KeyboardFacade)) {
    singleton = new KeyboardFacade(
      new KeyBoardService(
        new KeyboardRepository(db()),
        keyFacade().keyService,
        membershipStatusFacade().membershipStatusService,
        designKeyboardFacade().designKeyboardService
      )
    );
  }
  return singleton;
};
