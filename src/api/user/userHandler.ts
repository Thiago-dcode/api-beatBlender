import { NextFunction, Request, Response } from "express";
import { validateCreate, validateUpdate } from "./validate.js";
import { handleError, sendErrResponse } from "../../errors/handleErrors.js";
import UserService from "./userService.js";


class UserHandler {
  constructor(readonly userService: UserService) {
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
  }
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const all = await this.userService.getAll();
      res.status(200).json(all);
    } catch (error) {
      next(error);
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
  create = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get data from request
      const userId = req.user?.id;
      const file = req.file;
      const body = req.body;
      const username = req.params.username.toLowerCase();
      // Check if the user logged in is the same who is attempt to update
      await this.userService.throwErrorIfUserNotAuth(userId, username);
      const result = validateUpdate(body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const dataToUpdate = result.data;
      const updateResult = await this.userService.updateOrError(
        username,
        dataToUpdate,
        file
      );
      res.json(updateResult);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const username = req.params.username.toLowerCase();
      await this.userService.throwErrorIfUserNotAuth(userId, username);
      await this.userService.deleteByUserNameOrError(username);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserHandler;
