import UserInfoRepository from "./userInfoRepository.js";
import { UserInfoToUpdate, userInfoToCreate } from "./types.js";
import { EntityNotFoundError, UnknowDbError } from "../../errors/db/db.js";
import UserService from "../user/userService.js";
export default class UserInfoService {
  constructor(private readonly userInfoRepo: UserInfoRepository) {}

  //This function must only be called when user is register by the first time
  async createOrError(data: userInfoToCreate) {
    //a user must only has one user_info row
    const user_infoExists = await this.userInfoRepo.findFirstById(data.id);
    //should never be truthy
    if (user_infoExists) {
      const deleteResult = await this.userInfoRepo.delete(data.id);
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
    userService: UserService
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
        `Error, userInfo with user_id ${userId}`,
        {},
        500
      );

    const totalSoundSize = sounds.reduce((total, curr) => total + curr.size, 0);
    const totalRecordSize = records.reduce(
      (total, curr) => total + curr.size,
      0
    );
    const UserInfoToUpdate = {
      space: parseFloat((totalRecordSize + totalSoundSize).toFixed(2)),
      sounds: sounds.length,
      keyboards: keyboards.length,
    };
    await this.updateOrError(userInfo?.id, UserInfoToUpdate);
  }

  async getFirstByUserAuthOrError(userId: number) {
    const userInfo = await this.userInfoRepo.findFirstById(userId);
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
