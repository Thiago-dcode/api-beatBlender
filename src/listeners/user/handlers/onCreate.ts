import { User } from "@prisma/client";
import UserRepository from "../../../api/user/userRepository.js";
import { db } from "../../../db/db.js";
import userFacade from "../../../core/facade/userFacade.js";
import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import membershipFacade from "../../../core/facade/membershipFacade.js";
import config from "../../../config/config.js";
import membershipStatusFacade from "../../../core/facade/membershipStatusFacade.js";
import user from "../../../api/user/index.js";

const userRepository = new UserRepository(db());
export default async function onCreate(data: { user: User }) {
  const { username, id } = data.user;

 await userFacade.userService.updateOrError(username, {
    avatar: `free/avatar/avatar`,
  });
  await setInitialUserInfo(data.user)
}

const setInitialUserInfo = async (user: User) => {
  //get free membership
  const membership = await membershipFacade.membershipService.getByIdOrError(
    config.membership.free
  );
  //create new user_info related row
  const userInfo = await userInfoFacade.userInfoService.createOrError({
    sounds: 0,
    space: 0,
    keyboards: 0,
    userId: user.id,
  });
  const membershipStatus =
    await membershipStatusFacade.membershipStatusService.createOrError({
      membership_id: membership.id,
      user_infoId: userInfo.id,
    });
  //create new membership_status related to user_info and membership
};
