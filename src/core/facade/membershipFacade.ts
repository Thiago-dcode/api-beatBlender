//membershipFacade.ts
import { db } from "../../db/db.js";
import MembershipRepository from "../../api/membership/membershipRepository.js";
import MembershipService from "../../api/membership/MembershipService.js";
/**
 * Facade for interacting with membership information-related functionality.
 * Provides a simplified interface for accessing membership information services.
 */
class MembershipFacade {
  readonly membershipService: MembershipService;

  /**
   * Constructs a new instance of MembershipFacade.
   * @param membershipService The membership information service to be used.
   */
  constructor(membershipService: MembershipService) {
    this.membershipService = membershipService;
  }
}

// Instantiate MembershipFacade with dependencies
const membershipFacade = new MembershipFacade(
  new MembershipService(new MembershipRepository(db()))
);

export default membershipFacade;
