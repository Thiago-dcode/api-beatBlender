import { Request, Response } from "express";
import { validateCreate, validateUpdate } from "./validate.js";
import { handleError, sendErrResponse } from "../../errors/handleErrors.js";
import UserService from "./userService.js";
import { json } from "body-parser";
import { parse } from "path";
import { number } from "zod";
import { AuthorizationError } from "../../errors/auth/auth.js";

class UserHandler {
  constructor(readonly userService: UserService) {
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
  }
  index = async (req: Request, res: Response) => {
    try {
      const all = await this.userService.getAll();
      res.status(200).json(all);
    } catch (error) {
      console.error("Error fetching all users", error);
      sendErrResponse(res, error, handleError);
    }
  };
  show = async (req: Request, res: Response) => {
    try {
      const username = req.params.username.toLowerCase();
      const user = await this.userService.getByUserNameOrError(username);
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user", error);
      sendErrResponse(res, error, handleError);
    }
  };
  create = async (req: Request, res: Response) => {
    try {
      const result = validateCreate(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userCreateResult = await this.userService.createOrError(
        result.data
      );
      res.json(userCreateResult);
    } catch (error) {
      console.error("Error creating user", error);
      sendErrResponse(res, error, handleError);
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const username = req.params.username.toLowerCase();
      // Check authorization before proceeding with the update
      await this.userService.throwErrorIfUserNotAuth(userId, username);
      const result = validateUpdate(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const updateResult = await this.userService.updateOrError(
        username,
        result.data
      );
      res.json(updateResult);
    } catch (error) {
      console.error("Error updating user", error);
      sendErrResponse(res, error, handleError);
    }
  };
  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const username = req.params.username.toLowerCase();
      await this.userService.throwErrorIfUserNotAuth(userId, username);
      await this.userService.deleteByUserNameOrError(username);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error fetching user", error);
      sendErrResponse(res, error, handleError);
    }
  };
}

export default UserHandler;
