//userFacade.ts
import UserRepository from "../../api/user/userRepository.js";
import { db } from "../../db/db.js";
import UserService from "../../api/user/userService.js";
import StorageService from "../../services/logger/storage/storage.js";
import ResizeService from "../../services/resize/resize.js";

/**
 * Facade for interacting with user-related functionality.
 * Provides a simplified interface for accessing user services.
 */
class UserFacade {
  readonly userService: UserService;

  /**
   * Constructs a new instance of UserFacade.
   * @param userService The user service to be used.
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Add more methods as needed...
}

// Instantiate UserFacade with dependencies
const userFacade = new UserFacade(
  new UserService(
    new UserRepository(db()),
    new StorageService(new ResizeService())
  )
);

export default userFacade;

