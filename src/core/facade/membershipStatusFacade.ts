//membershipStatusFacade.ts
import { db } from "../../db/db.js";
import MembershipSatusRepository from "../../api/membershipStatus/membershipStatusRepository.js";
import MembershipStatusService from "../../api/membershipStatus/MembershipStatusService.js";
import userInfoFacade from "./userInfoFacade.js";
/**
 * Facade for interacting with membership_Status information-related functionality.
 * Provides a simplified interface for accessing membership_status information services.
 */
class MembershipStatusFacade {
  /**
   * Constructs a new instance of membershipStatusFacade.
   * @param membershipStatusService The membership_status information service to be used.
   */
  constructor(readonly membershipStatusService: MembershipStatusService) {}
}

// Instantiate membershipStatusFacade with dependencies

let singleton: MembershipStatusFacade;

export default () => {
  if (!(singleton instanceof MembershipStatusFacade)) {
    singleton = new MembershipStatusFacade(
      new MembershipStatusService(
        new MembershipSatusRepository(db()),
        userInfoFacade().userInfoService
      )
    );
  }
  return singleton;
};
