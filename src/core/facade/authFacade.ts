// authFacade.ts
import { db } from "../../db/db.js";
import authRepository from "../../api/auth/authRepository.js";
import AuthService from "../../api/auth/authService.js";
import initUserFacade from "./userFacade.js";

const userFacade = initUserFacade();
/**
 * Facade for interacting with auth information-related functionality.
 * Provides a simplified interface for accessing auth information services.
 */
console.log("AUTH  FACADE");
class AuthFacade {
  /**
   * Constructs a new instance of AuthFacade.
   * @param authService The auth information service to be used.
   */
  constructor(readonly authService: AuthService) {}
}

// Instantiate AuthFacade with dependencies
let singleton: AuthFacade;

export default () => {
  if (!(singleton instanceof AuthFacade)) {
    singleton = new AuthFacade(
      new AuthService(new authRepository(db()), userFacade.userService)
    );
  }
  return singleton;
};
