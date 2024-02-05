import { NextFunction, Request, Response } from "express";
import { validateSound } from "./validate.js";
import SoundService from "./soundService.js";

class soundHandler {
  constructor(private readonly SoundService: SoundService) {
    this.index = this.index.bind(this);
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      console.log("req.user", req.user);
      const sounds = await this.SoundService.allByUserOrError(userId);
      res.json({
        sounds,
      });
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validateSound(req.body);
      if (!result.success) {
        return res.status(422).json(result.error.flatten().fieldErrors);
      }
      const sounds = req.files as Express.Multer.File[];
      const userId = req.user?.id;
      const soundsCreated = await this.SoundService.createManyOrError(
        sounds,
        userId,
        result.data
      );
      return res.json(soundsCreated);
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      await this.SoundService.deleteSoundByIdOrError(id,userId);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default soundHandler;
