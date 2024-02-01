import { CookieOptions } from "express";
import { EntityNotFoundError } from "../../errors/db/db.js";
import {
  comparePassword,
  env,
  getJWTpayLoadOrError,
  getSecretJWT,
} from "../../utils/utils.js";
import authRepository from "./authRepository.js";
import { LogginUser } from "./types.js";
import JWT from "jsonwebtoken";
import { strict } from "assert";
import {
  AuthorizationError,
  PayLoadNotFoundError,
} from "../../errors/auth/auth.js";
export default class AuthService {
  private authRepo;
  constructor(authRepo: authRepository) {
    this.authRepo = authRepo;
  }

  async authJWT(data: LogginUser) {
    const userExist = await this.authRepo.findByUsername(data.username);
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

    const accessToken = JWT.sign({ id: userExist.id }, getSecretJWT(), {
      expiresIn: "15m",
    });
    const refreshToken = JWT.sign({ id: userExist.id }, getSecretJWT(), {
      expiresIn: "3h",
    });
    //set refreshToken to user table

    const user = await (
      await this.authRepo.setRefreshToken(userExist.id, refreshToken)
    ).findByUsername(data.username);
    console.log("USER TOKEN", user);
    return {
      user: userExist,
      accessToken,
      refreshToken,
    };
  }
  async invalidRefreshToken(id: number) {
    await this.authRepo.setRefreshToken(id, null);
  }
  async logOutJWT() {}

  async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new AuthorizationError("No refreshToken given", 403);

    const payload = getJWTpayLoadOrError(JWT, refreshToken, getSecretJWT());

    if (!(typeof payload === "object" && "id" in payload))
      throw new PayLoadNotFoundError("Payload refreshToken not found", 403);
    const id = payload.id;
    const user = await this.authRepo.findById(id);
    if (!user)
      throw new AuthorizationError("No user found in refresh token", 403);

    if (user.token !== refreshToken)
      throw new AuthorizationError("Refresh token mismatch user db token", 403);

    const newAccessToken = JWT.sign({ id: user.id }, getSecretJWT(), {
      expiresIn: "15m",
    });
    const newRefreshToken = JWT.sign({ id: user.id }, getSecretJWT(), {
      expiresIn: "3h",
    });
    await this.authRepo.setRefreshToken(user.id, newRefreshToken);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
}
