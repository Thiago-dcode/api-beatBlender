import UserService from "../../api/user/userService.js";
import UserInfoService from "../../api/userInfo/userInfoService.js";
import { CustomError } from "../../errors/CustomError.js";
import Listener from "../Listener.js";
import { GlobalEvents } from "../globalTypes.js";
import SoundListener from "../sound/SoundListener.js";
import { SoundEvents } from "../sound/type.js";
import SoundFolderListener from "../soundFolder/SoundFolderListener.js";
import { SoundFolderEvents } from "../soundFolder/type.js";

const updateUserInfoData = async <T extends typeof Listener>(
  userId: number,
  userInfoService: UserInfoService,
  userService: UserService,
  listener: T
) => {
  try {
    await userInfoService.extractUserInfoFromUserAndUpdateOrError(
      userId,
      userService
    );
    listener.emit(GlobalEvents.Success, true);
  } catch (error) {
  
    if (error instanceof Error)
      listener.emit(
        GlobalEvents.Error,
        error instanceof Error
          ? error
          : new CustomError(
              "Error during updateUserInfoData user id: " + userId,
              {},
              500
            )
      );
  }
};

export default updateUserInfoData;
