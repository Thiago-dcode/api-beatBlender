// userInfoFacade.ts
import { db } from "../../db/db.js";
import UserInfoRepository from "../../api/userInfo/userInfoRepository.js";
import UserInfoService from "../../api/userInfo/userInfoService.js";

/**
 * Facade for interacting with user information-related functionality.
 * Provides a simplified interface for accessing user information services.
 */
class UserInfoFacade {
  readonly userInfoService: UserInfoService;

  /**
   * Constructs a new instance of UserInfoFacade.
   * @param userInfoService The user information service to be used.
   */
  constructor(userInfoService: UserInfoService) {
    this.userInfoService = userInfoService;
  }
}

// Instantiate UserInfoFacade with dependencies
const userInfoFacade = new UserInfoFacade(
  new UserInfoService(new UserInfoRepository(db()))
);

export default userInfoFacade;
