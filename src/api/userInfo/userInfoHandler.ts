import { NextFunction, Request, Response } from "express";
import { validateUserIdRequest } from "../../utils/utils.js";
import UserInfoService from "./userInfoService.js";
import { AuthorizationError } from "../../errors/auth/auth.js";
export default class userInfoHandler {
  constructor(private readonly userInfoService: UserInfoService) {
    this.show = this.show.bind(this);
  }

  //   index = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const userId = validateUserIdRequest(req.user?.id);
  //       console.log("req.user", req.user);
  //       const sounds = await this.SoundService.allByUserOrError(userId);
  //       res.json({
  //         sounds,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = validateUserIdRequest(req.user?.id);
      const id = parseInt(req.params.id);
      if (userId !== id) throw new AuthorizationError("Not authorized", {});
      const userInfo = await this.userInfoService.getFirstByUserAuthOrError(
        userId
      );
      res.json({
        userInfo,
      });
    } catch (error) {
      next(error);
    }
  };
}
