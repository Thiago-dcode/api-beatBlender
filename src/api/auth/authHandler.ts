import { Request, Response } from "express";
import { validateLoggin } from "./validate.js";
import { handleError, sendErrResponse } from "../../errors/handleErrors.js";
import AuthService from "./authService.js";
import { EntityNotFoundError } from "../../errors/db/db.js";

class AuthHandler {
  constructor(private readonly authService: AuthService) {
    this.loggin = this.loggin.bind(this);
  }

  loggin = async (req: Request, res: Response) => {
    try {
      const result = validateLoggin(req.body);

      if (!result.success) {
        throw new EntityNotFoundError("Invalid credentials", 404);
      }
      const userAuthenticated = await this.authService.authJWT(result.data);
      res.cookie("refreshToken", userAuthenticated.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      res.json({
        user: userAuthenticated.user,
        token: userAuthenticated.token,
      });
    } catch (error) {
      console.error("Error authenticating user", error);
      sendErrResponse(res, error, handleError);
    }
  };
}

export default AuthHandler;
