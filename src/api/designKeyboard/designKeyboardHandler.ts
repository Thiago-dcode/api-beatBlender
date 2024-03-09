import { NextFunction, Request, Response } from "express";

import DesignKeyboardService from "./designKeyboardService.js";
import { EntityNotFoundError } from "../../errors/db/db.js";

class DesignKeyboardHandler {
  constructor(private readonly designKeyboardService: DesignKeyboardService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const designs = await this.designKeyboardService.getAllOrError();

      res.json(designs);
    } catch (error) {
      next(error);
    }
  };
}

export default DesignKeyboardHandler;
