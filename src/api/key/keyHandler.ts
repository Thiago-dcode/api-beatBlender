import { NextFunction, Request, Response } from "express";
import { validateKey, validateKeyOptional } from "./validate.js";
import { validateUserIdRequest } from "../../utils/utils.js";
import KeyService from "./keyService.js";
export default class KeyHandler {
  constructor(private readonly keyService: KeyService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = validateUserIdRequest(req.user?.id);
      const keys = await this.keyService.allByUserOrError(userId);
      res.json(keys);
    } catch (error) {
      next(error);
    }
  };
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      const key = await this.keyService.getOneByIdOrError(id, userId);
      res.json({
        key,
      });
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateKey(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }

      const userId = validateUserIdRequest(req.user?.id);
      const soundFile = req.file;

      const keyCreated = await this.keyService.createOrError({
        ...result.data,
        userId,
        soundFile,
      });
      return res.json(keyCreated);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateKeyOptional(req.body);

      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      const soundFile = req.file;
      const keyUpdated = await this.keyService.updateOrError(id, {
        ...result.data,
        userId,
        soundFile,
      });

      return res.json(keyUpdated);
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      await this.keyService.deleteOrError(id);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
