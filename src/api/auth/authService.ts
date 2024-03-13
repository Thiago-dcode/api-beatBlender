import { EntityNotFoundError } from "../../errors/db/db.js";
import config from "../../config/config.js";
import {
  comparePassword,
  getJWTpayLoadOrError,
  getSecretJWTOrError,
} from "../../utils/utils.js";
import authRepository from "./authRepository.js";
import { LogginUser } from "./types.js";
import JWT from "jsonwebtoken";
import {
  AuthorizationError,
  PayLoadNotFoundError,
} from "../../errors/auth/auth.js";
import UserService from "../user/userService.js";
export default class AuthService {
  private readonly authRepo;
  private readonly userService;
  constructor(authRepo: authRepository, userService: UserService) {
    this.authRepo = authRepo;
    this.userService = userService;
  }

  async authJWT(data: LogginUser) {
    const userExist = await this.authRepo.findByUsername(data.username);
    if (!userExist) {
      throw new EntityNotFoundError(`Wrong credentiales`, {}, 400);
    }
    const validPassword = await comparePassword(
      data.password,
      userExist.password
    );
    if (!validPassword) {
      throw new EntityNotFoundError(`Wrong credentiales`, {}, 404);
    }
    let avatarUrl = "";
    if (userExist.avatar)
      avatarUrl = await this.userService.getAvatarUrlOrError(userExist.avatar);
    const secretKey = getSecretJWTOrError();
    const accessToken = JWT.sign({ id: userExist.id }, secretKey, {
      expiresIn: config.JWT.expire,
    });
    const refreshToken = JWT.sign({ id: userExist.id }, secretKey, {
      expiresIn: config.JWT.refreshExpire,
    });
    //set refreshToken to user table
    await this.authRepo.setRefreshToken(userExist.id, refreshToken);
    return {
      user: { avatarUrl, ...userExist },
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
      throw new AuthorizationError("No refreshToken given", {}, 403);
    const secretKey = getSecretJWTOrError();
    const payload = getJWTpayLoadOrError(JWT, refreshToken, secretKey, 403);

    if (!(typeof payload === "object" && "id" in payload))
      throw new PayLoadNotFoundError("Payload refreshToken not found", {}, 403);
    const id = payload.id;
    const user = await this.authRepo.findById(id);
    if (!user)
      throw new AuthorizationError("No user found in refresh token", {}, 403);

    if (user.token !== refreshToken)
      throw new AuthorizationError(
        "Refresh token mismatch user db token",
        {},
        403
      );

    const newAccessToken = JWT.sign({ id: user.id }, secretKey, {
      expiresIn: config.JWT.expire,
    });
    const newRefreshToken = JWT.sign({ id: user.id }, secretKey, {
      expiresIn: config.JWT.refreshExpire,
    });
    await this.authRepo.setRefreshToken(user.id, newRefreshToken);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }
}
