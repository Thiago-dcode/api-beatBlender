//membershipStatusFacade.ts
import { db } from "../../db/db.js";
import MembershipSatusRepository from "../../api/membershipStatus/membershipStatusRepository.js";
import MembershipStatusService from "../../api/membershipStatus/MembershipStatusService.js";
/**
 * Facade for interacting with membership_Status information-related functionality.
 * Provides a simplified interface for accessing membership_status information services.
 */
class MembershipStatusFacade {
  readonly membershipStatusService: MembershipStatusService;

  /**
   * Constructs a new instance of membershipStatusFacade.
   * @param membershipStatusService The membership_status information service to be used.
   */
  constructor(membershipStatusService: MembershipStatusService) {
    this.membershipStatusService = membershipStatusService;
  }
}

// Instantiate membershipStatusFacade with dependencies
const membershipStatusFacade = new MembershipStatusFacade(
  new MembershipStatusService(new MembershipSatusRepository(db()))
);

export default membershipStatusFacade;
