import { NextFunction, Request, Response } from "express";
import { validateLoggin } from "./validate.js";
import { handleError, sendErrResponse } from "../../errors/handleErrors.js";
import AuthService from "./authService.js";
import { EntityNotFoundError } from "../../errors/db/db.js";

class AuthHandler {
  constructor(private readonly authService: AuthService) {
    this.loggin = this.loggin.bind(this);
  }

  loggin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateLoggin(req.body);

      if (!result.success) {
        throw new EntityNotFoundError("Invalid credentials",{}, 404);
      }
      const userAuthenticated = await this.authService.authJWT(result.data);
      res.cookie("refresh_token", userAuthenticated.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      res.json({
        user: {...userAuthenticated.user,token:'',password:''},
        accessToken: userAuthenticated.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refresh_token ?? "";
      console.log("refreshToken", req.cookies);
      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      res.json({
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthHandler;
