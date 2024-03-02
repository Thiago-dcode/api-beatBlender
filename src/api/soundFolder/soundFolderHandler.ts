import { NextFunction, Request, Response } from "express";
import { validateSoundFolder } from "./validate.js";
import SoundFolderService from "./soundFolderService.js";
import { validateUserIdRequest } from "../../utils/utils.js";

class SoundFolderHandler {
  constructor(private readonly soundFolderService: SoundFolderService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //TODO: get all folders with sounds by user
      const userId = validateUserIdRequest(req.user?.id);
      const soundsFolder = await this.soundFolderService.allByUserOrError(
        userId
      );
      res.json({
        soundsFolder,
      });
    } catch (error) {
      next(error);
    }
  };
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = validateUserIdRequest(req.user?.id);
      console.log("req.user", req.user);
      const soundFolder =
        await this.soundFolderService.getByIdIfUserIsAuthOrError(id, userId);
      res.json({
        soundFolder,
      });
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateSoundFolder(req.body);

      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userId = validateUserIdRequest(req.user?.id);

      const soundFolderCreated =
        await this.soundFolderService.getByNameOrCreateOrError(
          result.data.name,
          userId
        );

      return res.json(soundFolderCreated);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateSoundFolder(req.body);

      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      const soundFolderUpdated =
        await this.soundFolderService.updateWithUniqueNameOrError(
          id,
          result.data.name,
          userId
        );
      return res.json(soundFolderUpdated);
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = validateUserIdRequest(req.user?.id);
      await this.soundFolderService.deleteSoundFolderOrError(id, userId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SoundFolderHandler;
