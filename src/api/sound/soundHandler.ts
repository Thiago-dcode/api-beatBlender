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
      const sounds = req.files as Express.Multer.File[];
    
      
      // if (!result.success) {
      //   return res.status(422).json(result.error.flatten().fieldErrors);
      // }
      // const soundsCreated = await this.SoundService.createOrError(
      //   result.data
      // );
      // res.json(soundsCreated);

      res.end();
    } catch (error) {
      next(error);
    }
  };
}

export default soundHandler;
