import { Request, Response } from "express";
import UserRepository from "./repository.js";
import { db } from "../../db/db.js";

const user = new UserRepository(db());
class UserHandler {
  constructor() {}
  async index(req: Request, res: Response) {
    const all = await user.all();
    res.status(200).json(all);
  }

  async create(req: Request, res: Response) {
    const body = req.body;
    try {
      const result = await user.new(body);
    } catch (error) {
      // TODO: handle errors
    }
  }
}

export default new UserHandler();
