// authFacade.ts
import { db } from "../../db/db.js";
import authRepository from "../../api/auth/authRepository.js";
import AuthService from "../../api/auth/authService.js";
import userFacade from "./userFacade.js";

/**
 * Facade for interacting with auth information-related functionality.
 * Provides a simplified interface for accessing auth information services.
 */
class AuthFacade {
  readonly authService: AuthService;

  /**
   * Constructs a new instance of AuthFacade.
   * @param authService The auth information service to be used.
   */
  constructor(authService: AuthService) {
    this.authService = authService;
  }
}

// Instantiate AuthFacade with dependencies
const authFacade = new AuthFacade(new AuthService(new authRepository(db()), userFacade.userService));

export default authFacade;
