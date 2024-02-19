import { NextFunction, Request, Response } from "express";
import { validateKeyboard, validateKeyboardOptional } from "./validate.js";
import { validateUserIdRequest } from "../../utils/utils.js";

import KeyBoardService from "./keyboardService.js";
export default class KeyboardHandler {
  constructor(private readonly keyBoardService: KeyBoardService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = validateUserIdRequest(req.user?.id);
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
      const keyboards = await this.keyBoardService.allByUserWithKeysOrError(
        userId,
        categories
      );
      res.json({
        keyboards,
      });
    } catch (error) {
      next(error);
    }
  };
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      const keyboard = await this.keyBoardService.getOneByIdOrError(id, userId);
      res.json({
        keyboard,
      });
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateKeyboard(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userId = validateUserIdRequest(req.user?.id);
      const keyboardCreated = await this.keyBoardService.createOrError({
        ...result.data,
        userId,
      });
      return res.json(keyboardCreated);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateKeyboardOptional(req.body);

      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      const keyboardUpdated = await this.keyBoardService.updateOrError(id, {
        ...result.data,
        userId,
      });

      return res.json(keyboardUpdated);
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      await this.keyBoardService.deleteOrError(id);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
