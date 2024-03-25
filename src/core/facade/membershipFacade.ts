//membershipFacade.ts
import { db } from "../../db/db.js";
import MembershipRepository from "../../api/membership/membershipRepository.js";
import MembershipService from "../../api/membership/MembershipService.js";
/**
 * Facade for interacting with membership information-related functionality.
 * Provides a simplified interface for accessing membership information services.
 */
class MembershipFacade {
  /**
   * Constructs a new instance of MembershipFacade.
   * @param membershipService The membership information service to be used.
   */
  constructor(readonly membershipService: MembershipService) {}
}

// Instantiate MembershipFacade with dependencies

let singleton: MembershipFacade;

export default () => {
  if (!(singleton instanceof MembershipFacade)) {
    singleton = new MembershipFacade(
      new MembershipService(new MembershipRepository(db()))
    );
  }
  return singleton;
};
