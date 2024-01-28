import { Request, Response } from "express";
import UserRepository from "./repository.js";
import { validateCreate } from "./validate.js";
import { db } from "../../db/db.js";
import { handleError } from "../../error/handleError.js";
import bcrypt from "bcryptjs";
const user = new UserRepository(db());
class UserHandler {
  constructor() {}
  async index(req: Request, res: Response) {
    const all = await user.all();
    res.status(200).json(all);
  }

  async create(req: Request, res: Response) {
    try {
      const result = validateCreate(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      //TODO: hash password
      const passwordHashed = await bcrypt.hash(result.data.password, 10);
      result.data.password = passwordHashed;
      const userCreateResult = await user.new(result.data);
      res.json(userCreateResult);
    } catch (error) {
      if (error instanceof Error) {
        const err = handleError(error);
        return res.status(err.code || 500).json({
          [err.target]: [err.message],
        });
      }
      return res.status(500).json({
        server: ["Server error, error is not a instanceof Error"],
      });
    }
  }
}

export default new UserHandler();
