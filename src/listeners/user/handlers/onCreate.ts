import { User } from "@prisma/client";
import userFacade from "../../../core/facade/userFacade.js";
import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import membershipFacade from "../../../core/facade/membershipFacade.js";
import config from "../../../config/config.js";
import membershipStatusFacade from "../../../core/facade/membershipStatusFacade.js";
import logger from "../../../services/logger/logger.js";
import UserListener from "../UserListener.js";
import { UserData, UserEvents } from "../type.js";

export default async function onCreate(data: UserData[UserEvents.Create]) {
  const { username, id } = data.user;
  try {
    await userFacade.userService.updateOrError(username, {
      avatar: `free/avatar/avatar`,
    });
    await setInitialUserInfo(data.user);
  } catch (error) {
    if (error instanceof Error) UserListener.emit(UserEvents.Error, error);
  }
}

const setInitialUserInfo = async (user: User) => {
  //get free membership

  const membership = await membershipFacade.membershipService.getByIdOrError(
    config.membership.free.id
  );
  //create new user_info related row
  const userInfo = await userInfoFacade.userInfoService.createOrError({
    id: user.id,
    sounds: 0,
    space: 0,
    keyboards: 0,
  });
  const membershipStatus =
    await membershipStatusFacade.membershipStatusService.createOrError({
      membership_id: membership.id,
      user_infoId: userInfo.id,
    });
  UserListener.emit(UserEvents.SuccessCreate, true);
  logger.daily.info("User initial setting:", { userInfo });
};
