import { EntityNotFoundError } from "../../errors/db/db.js";
import { comparePassword, env } from "../../utils/utils.js";
import authRepository from "./authRepository.js";
import { LogginUser } from "./types.js";
import JWT from "jsonwebtoken";
export default class AuthService {
  private userRepo;
  constructor(userRepo: authRepository) {
    this.userRepo = userRepo;
  }

  async authJWT(data: LogginUser) {
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

    const token = JWT.sign({ userId: userExist.id }, env.get("JWT_KEY"), {
      expiresIn: "30m",
    });

    return {
      user: userExist,
      token,
    };
  }
  async logOutJWT() {

      
  }
  async refreshToken(token:string){
      //15 min exp access token
      //20 min exp refresh
    //get the access token
      //!valid throw error
      //get refresh_token from cookies
      //!exist continue
      //


  }
}
