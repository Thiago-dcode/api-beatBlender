import KeyService from "../key/keyService.js";
import KeyBoardService from "../keyboard/keyboardService.js";

export default class FreeService {
  constructor(
    private readonly freeUserId: number,
    private readonly keyboardService: KeyBoardService,
    private readonly keyService: KeyService
  ) {}

  async allKeyboardsOrError(limit: number = 4) {
    const keyboards = await this.keyboardService.allByUserOrError(
      this.freeUserId,
      undefined,
      limit
    );

    return keyboards;
  }
  async getOneKeyboardByIdOrError(id: number) {
    const keyboard = await this.keyboardService.getOneByIdOrError(
      id,
      this.freeUserId
    );
    return keyboard;
  }
}
