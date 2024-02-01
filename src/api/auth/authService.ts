import { CookieOptions } from "express";
import { EntityNotFoundError } from "../../errors/db/db.js";
import { comparePassword, env, getSecretJWT } from "../../utils/utils.js";
import authRepository from "./authRepository.js";
import { LogginUser } from "./types.js";
import JWT from "jsonwebtoken";
import { strict } from "assert";
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

    const token = JWT.sign({ id: userExist.id }, getSecretJWT(), {
      expiresIn: "30m",
    });
    const refreshToken = JWT.sign({ id: userExist.id }, getSecretJWT(), {
      expiresIn: "3h",
    });
    //set refreshToken to user table
    
    return {
      user: userExist,
      token,
      refreshToken,
    };
  }
  async logOutJWT() {}
  async refreshToken(token: string) {
    //15 min exp access token
    //1h exp refresh
    //get refresh_token from cookies
    //!exist throw Error unauth
    //!valid throw error unauth
    //get the user id of the payload
    //check in token column if the user has that refresh token
    //doesnt? throw Erro unauth
    //remove that token from the column
    //create new one refresh
    //store in the db
    //send back in a httponly cookie session
    //create new access token
    //send back the access token
  }
}
