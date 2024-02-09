import { User } from "@prisma/client";
import UserRepository from "../../../api/user/userRepository.js";
import { db } from "../../../db/db.js";
import userFacade from "../../../core/facade/userFacade.js";
import userInfoFacade from "../../../core/facade/userInfoFacade.js";

const userRepository = new UserRepository(db());
export default async function onCreate(data: { user: User }) {
  const { username, id } = data.user;

  userFacade.userService.updateOrError(username, {
    avatar: `free/avatar/avatar`,
  });
}

const setInitialUserInfo = async (user: User) => {
  userFacade.userService.updateOrError(user.username, {
    avatar: `free/avatar/avatar`,
  });
  const userInfo = await userInfoFacade.userInfoService.createOrUpdateOrError({
    sounds: 0,
    space: 0,
    keyboards: 0,
    userId: user.id,
  });
};
