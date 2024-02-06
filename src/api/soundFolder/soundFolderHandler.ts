import { NextFunction, Request, Response } from "express";
import { validateSoundFolder } from "./validate.js";
import SoundFolderService from "./soundFolderService.js";
import { AuthorizationError } from "../../errors/auth/auth.js";

class SoundFolderHandler {
  constructor(private readonly soundFolderService: SoundFolderService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //TODO: get all folders with sounds by user
      const userId = req.user?.id;
      console.log("req.user", req.user);
      const sounds = await this.soundFolderService.allByUserOrError(userId);
      res.json({
        sounds,
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
      const userId = req.user?.id;
      if (userId !== result.data.userId)
        throw new AuthorizationError(
          "This user is not authorized to do this operation",
          {}
        );
      const soundFolderCreated =
        await this.soundFolderService.getByNameOrCreateOrError(
          result.data.name,
          result.data.userId
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
      const userId = req.user?.id;
      if (userId !== result.data.userId)
        throw new AuthorizationError(
          "This user is not authorized to do this operations",
          {}
        );
      const id = parseInt(req.params.id);
      const soundFile = req.file;
      // const soundUpdated = await this.soundFolderService.updateOrError(
      //   id,
      //   result.data,
      //   soundFile
      // );
      // return res.json(soundUpdated);
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      // await this.soundFolderService.deleteSoundByIdOrError(id, userId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SoundFolderHandler;
