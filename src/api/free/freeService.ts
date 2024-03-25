import { User } from "@prisma/client";
import config from "../../config/config.js";
import KeyService from "../key/keyService.js";
import KeyBoardService from "../keyboard/keyboardService.js";
import UserService from "../user/userService.js";

export default class FreeService {

  constructor(
    private readonly userService: UserService,
    private readonly keyboardService: KeyBoardService,
    private readonly keyService: KeyService
  ) {
   
  }

  async allKeyboardsOrError(limit: number = 4) {

   const {id} = await this.userService.getByUserNameOrError(
      config.user.free.username
    );
    const keyboards = await this.keyboardService.allByUserOrError(
      id,
      undefined,
      limit
    );

    return keyboards;
  }
  async getOneKeyboardByIdOrError(id: number) {
    const {id:userId} = await this.userService.getByUserNameOrError(
      config.user.free.username
    );
    const keyboard = await this.keyboardService.getOneByIdOrError(
      id,
      userId
    );
    return keyboard;
  }
  async getOneKeyboardNameOrError(name: string) {
    const {id:userId} = await this.userService.getByUserNameOrError(
      config.user.free.username
    );
    const keyboard = await this.keyboardService.getOneByNameOrError(
      name,
      userId
    );
    return keyboard;
  }
}
