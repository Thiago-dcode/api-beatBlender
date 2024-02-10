import { User, User_info } from "@prisma/client";
import UserInfoRepository from "./userInfoRepository.js";
import { UserInfoToUpdate, userInfoToCreate } from "./types.js";
import { EntityNotFoundError, UnknowDbError } from "../../errors/db/db.js";
import { AuthorizationError } from "../../errors/auth/auth.js";
import UserService from "../user/userService.js";
import MembershipStatusService from "../membershipStatus/MembershipStatusService.js";
export default class UserInfoService {
  constructor(private readonly userInfoRepo: UserInfoRepository) {}

  //This function must only be called when user is register by the first time
  async createOrError(data: userInfoToCreate) {
    //a user must only has one user_info row
    const user_infoExists = await this.userInfoRepo.findFirstByUserId(
      data.userId
    );
    //should never be truthy
    if (user_infoExists) {
      const deletedAllUserInfo = await this.userInfoRepo.deleteByUserId(
        data.userId
      );
    }
    const user_infoCreated = await this.userInfoRepo.create(data);
    return user_infoCreated;
  }
  async updateOrError(id: number, data: UserInfoToUpdate) {
    const userInfoUpdated = await this.userInfoRepo.update(id, data);

    return userInfoUpdated;
  }

  async extractUserInfoFromUserAndUpdateOrError(
    userId: number,
    userService: UserService,
    membershipStatusService: MembershipStatusService
  ) {
    const user = await userService.getByIdWithRelationsOrError(userId, {
      sounds: true,
      user_info: true,
      keyboards: true,
      records: true,
    });
    const { sounds, keyboards, records, user_info: userInfo } = user;
    if (!userInfo)
      throw new EntityNotFoundError(
        `Error, userInfo null on SoundListener.onCreateMany with user_id ${userId}`,
        {},
        500
      );
    //TODO: check if the user_info dont exceed his membership constraints
    //Create that login on membershipStatusService

    const totalSoundSize = sounds.reduce((total, curr) => total + curr.size, 0);
    const totalRecordSize = records.reduce(
      (total, curr) => total + curr.size,
      0
    );
    const UserInfoToUpdate = {
      sounds: sounds.length,
      space: totalRecordSize + totalSoundSize,
      keyboards: keyboards.length,
    };
    const membershipStatus =
      membershipStatusService.handleUserMembershipByUserInfoOrError(
        userInfo.id,
        UserInfoToUpdate
      );
    await this.updateOrError(userInfo?.id, UserInfoToUpdate);
  }

  async getFirstByUserAuthOrError(userId: number) {
    const userInfo = await this.userInfoRepo.findFirstByUserId(userId);
    if (!userInfo) {
      throw new EntityNotFoundError(
        `UserInfo with userId ${userId} not found`,
        {},
        500
      );
    }
    return userInfo;
  }
}
