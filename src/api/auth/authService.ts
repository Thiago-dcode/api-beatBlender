import {
  EntityNotFoundError,
} from "../../errors/db/db.js";
import { comparePassword } from "../../utils/utils.js";
import authRepository from "./authRepository.js";
import { LogginUser } from "./types.js";
import { Jwt } from "jsonwebtoken";
export default class AuthService {
  private userRepo;
  constructor(userRepo: authRepository) {
    this.userRepo = userRepo;
  }

  async authenticate(data: LogginUser) {
    const userExist = await this.userRepo.findByUsername(data.username);
    if (!userExist) {
      throw new EntityNotFoundError(`Wrong credentiales`, 404);
    }
    const validPassword = await comparePassword(
      data.password,
      userExist.password
    );
    if (!validPassword) {
      throw new EntityNotFoundError(`Wrong credentiales`, 404);
    }
    //Loggin success
    //Generate JWT


    return userExist
  }
}
