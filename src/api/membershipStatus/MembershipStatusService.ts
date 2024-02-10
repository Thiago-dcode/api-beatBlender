import { EntityNotFoundError } from "../../errors/db/db.js";
import { UserInfoToUpdate } from "../userInfo/types.js";
import MembershipSatusRepository from "./membershipStatusRepository.js";
import { membershipStatusToCreate } from "./types.js";
export default class MembershipStatusService {
  constructor(
    private readonly memberShipStatusRepo: MembershipSatusRepository
  ) {}

  //This function must only be called when user is register by the first time
  async getByUserInfoOrError(userInfoId: number) {
    const membership = await this.memberShipStatusRepo.findFirstByUserInfo(
      userInfoId
    );
    if (!membership) {
      throw new EntityNotFoundError(
        `Membership with userInfoId ${userInfoId} not found`,
        {},
        500
      );
    }
    return membership;
  }
  async handleUserMembershipByUserInfoOrError(
    userInfoId: number,
    UserInfoToUpdate: {
      keyboards: number;
      space: number;
      sounds: number;
    }
  ) {
    const membershipStatus = await this.getByUserInfoOrError(userInfoId);
    
    //TODO: check if the user is allowed to do
    const membership = membershipStatus.membership;

    if (membership.keyboards < UserInfoToUpdate.keyboards) {
      // throw new MEMBERSHIPERROR
    }
    if (membership.space < UserInfoToUpdate.space) {
      // throw new MEMBERSHIPERROR
    }
    if (membership.sounds < UserInfoToUpdate.sounds) {
      // throw new MEMBERSHIPERROR
    }
  }
  async createOrError(data: membershipStatusToCreate) {
    const membershipStatusExists =
      await this.memberShipStatusRepo.findFirstByUserInfo(data.user_infoId);
    if (membershipStatusExists) {
    }
    const membershipStatusCreated = await this.memberShipStatusRepo.create(
      data
    );
    return membershipStatusCreated;
  }
}
