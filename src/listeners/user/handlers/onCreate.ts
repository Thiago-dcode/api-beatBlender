import { User } from "@prisma/client";
import UserRepository from "../../../api/user/userRepository.js";
import { db } from "../../../db/db.js";
const userRepository = new UserRepository(db());
export default async function onCreate(data: { user: User }) {
  const { username, id } = data.user;
  userRepository.updateByUsername(username, {
    avatar: `free/avatar/avatar`,
  });
}

const setInitialUserInfo = (user: User) => {
      
};
