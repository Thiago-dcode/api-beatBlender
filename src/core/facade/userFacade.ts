//userFacade.ts
import UserRepository from "../../api/user/userRepository.js";
import { db } from "../../db/db.js";
import UserService from "../../api/user/userService.js";
import storageFacade from "./services/storageFacade.js";

/**
 * Facade for interacting with user-related functionality.
 * Provides a simplified interface for accessing user services.
 */
console.log("USER  FACADE");
class UserFacade {
  /**
   * Constructs a new instance of UserFacade.
   * @param userService The user service to be used.
   */
  constructor(readonly userService: UserService) {}

  // Add more methods as needed...
}

// Instantiate UserFacade with dependencies

let singleton: UserFacade;

export default () => {
  if (!(singleton instanceof UserFacade)) {
    singleton = new UserFacade(
      new UserService(new UserRepository(db()), storageFacade().storageService)
    );
  }
  return singleton;
};
