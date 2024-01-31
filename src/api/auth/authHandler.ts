import { Request, Response } from "express";
import { validateLoggin } from "./validate.js";
import { handleError } from "../../errors/handleErrors.js";
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
      const userAuthenticated = await this.authService.authenticate(result.data);
      res.json(userAuthenticated);
    } catch (error) {
      console.error("Error authenticating user", error);
      const err = handleError(error);
      return res.status(err.code).json({
        [err.target]: [err.message],
      });
    }
  };
}

export default AuthHandler;
