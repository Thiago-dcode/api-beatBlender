import { NextFunction, Request, Response } from "express";
import { validateLoggin } from "./validate.js";

import AuthService from "./authService.js";
import { EntityNotFoundError } from "../../errors/db/db.js";

class AuthHandler {
  constructor(private readonly authService: AuthService) {
    this.loggin = this.loggin.bind(this);
  }

  loggin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateLoggin(req.body);
      console.log("result", result, req.body);
      console.log("req.cookies()", req.headers.cookie);
      if (!result.success) {
        throw new EntityNotFoundError("Invalid credentials", {}, 404);
      }
      const userAuthenticated = await this.authService.authJWT(result.data);
      res.cookie("refresh_token", userAuthenticated.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.json({
        user: { ...userAuthenticated.user, token: "", password: "" },
        accessToken: userAuthenticated.accessToken,
        refreshToken: userAuthenticated.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body['refresh-token'];
      console.log("refreshToken", refreshToken);
      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      res.json({
        accessToken: newAccessToken,
        newRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthHandler;
