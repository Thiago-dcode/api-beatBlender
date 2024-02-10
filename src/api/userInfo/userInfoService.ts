import { User_info } from "@prisma/client";
import UserInfoRepository from "./userInfoRepository.js";
import { userInfoToCreate } from "./types.js";
import { EntityNotFoundError } from "../../errors/db/db.js";
import { AuthorizationError } from "../../errors/auth/auth.js";
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
  async getFirstByUserAuthOrError( userId: number) {
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
