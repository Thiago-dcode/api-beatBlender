import { EntityNotFoundError } from "../../errors/db/db.js";
import { MembershipExceedLimitError } from "../../errors/membership/membership.js";
import { UserInfoToUpdate } from "../userInfo/types.js";
import UserInfoService from "../userInfo/userInfoService.js";
import MembershipSatusRepository from "./membershipStatusRepository.js";
import { membershipStatusToCreate } from "./types.js";
export default class MembershipStatusService {
  constructor(
    private readonly memberShipStatusRepo: MembershipSatusRepository,
    private readonly userInfoService: UserInfoService
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
  async errorIfUserExceedMembership(
    userId: number,
    UserInfoToUpdate: {
      increaseKeyboards?: number;
      increaseSpace?: number;
      increaseSound?: number;
    }
  ) {
    //get the current user info:
    const userInfo = await this.userInfoService.getFirstByUserAuthOrError(
      userId
    );

    const membershipStatus = await this.getByUserInfoOrError(userInfo.id);
    const { increaseKeyboards, increaseSpace, increaseSound } =
      UserInfoToUpdate;
    //TODO: do something with membership status like check renewal

    //compare membership constraints with the new user_info
    const membership = membershipStatus.membership;
    const keyboards = userInfo.keyboards + (increaseKeyboards || 0);
    const sounds = userInfo.sounds + (increaseSound || 0);
    const space = userInfo.space + (increaseSpace || 0);

    if (membership.keyboards < keyboards) {
      throw new MembershipExceedLimitError(
        `Limit of ${membership.keyboards} keyboards exceeded`,
        {
          keyboards: "Limit exceeded",
        }
      );
    }
    if (membership.space < space) {
      throw new MembershipExceedLimitError(
        `Limit of ${membership.space}MB in space exceeded`,
        {
          space: "Limit exceeded",
        }
      );
    }
    if (membership.sounds < sounds) {
      throw new MembershipExceedLimitError(
        `Limit of ${membership.sounds} sounds exceeded`,
        {
          sounds: "Limit exceeded",
        }
      );
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
