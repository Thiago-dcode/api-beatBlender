import FreeService from "./freeService.js";
import { NextFunction, Request, Response } from "express";
export default class FreeHandler {
  constructor(private readonly freeService: FreeService) {}

  allKeyboards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoriesQuery = req.query.categories;
      let categories: string[] | undefined = undefined;
      if (Array.isArray(categoriesQuery)) {
        categories = categoriesQuery.map((category) => {
          if (typeof category === "string") {
            return category;
          }
          return "";
        });
      }
      const keyboards = await this.freeService.allKeyboardsOrError();
      res.json({
        keyboards,
      });
    } catch (error) {
      next(error);
    }
  };
  oneKeyboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = req.params.name;
      const keyboard = await this.freeService.getOneKeyboardNameOrError(name);
      res.json({
        keyboard,
      });
    } catch (error) {
      next(error);
    }
  };
}
