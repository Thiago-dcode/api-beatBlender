import { Request, Response } from "express";
import { validateCreate, validateUpdate } from "./validate.js";
import { handleError } from "../../errors/handleErrors.js";
import UserService from "./userService.js";

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
      const err = handleError(error);
      return res.status(err.code).json({
        [err.target]: [err.message],
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const result = validateCreate(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userCreateResult = await this.userService.create(result.data);
      res.json(userCreateResult);
    } catch (error) {
      console.error("Error creating user", error);
      const err = handleError(error);
      return res.status(err.code).json({
        [err.target]: [err.message],
      });
    }
  };
  update = async (req: Request, res: Response) => {
    try {
      const username = req.params.username;

      const result = validateUpdate(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const updateResult = await this.userService.update(username, result.data);
      res.json(updateResult);
    } catch (error) {
      console.error("Error updating user", error);
      const err = handleError(error);
      return res.status(err.code).json({
        [err.target]: [err.message],
      });
    }
  };
}

export default UserHandler;
