import { EntityNotFoundError, UnknowDbError } from "../../errors/db/db.js";
import { keyboardToCreate, keyboardToUpdate } from "./types.js";

import { AuthorizationError } from "../../errors/auth/auth.js";

import KeyboardRepository from "./keyboardRepository.js";
import KeyService from "../key/keyService.js";
import MembershipStatusService from "../membershipStatus/MembershipStatusService.js";
import KeyboardListener from "../../listeners/keyboard/KeyboardLIstener.js";
import config from "../../config/config.js";
import DesignKeyboardService from "../designKeyboard/designKeyboardService.js";
import { getRandomValueFromArray } from "../../utils/utils.js";

interface keyboardToCreateWithKeysAndCategories extends keyboardToCreate {
  keys?: number[];
  categories?: string[];
}
interface keyboardToUpdateeWithKeysAndCategories extends keyboardToUpdate {
  keys?: number[];
  categories?: string[];
  keysToDelete?: number[];
  categoriesToDelete?: string[];
}

export default class KeyBoardService {
  private readonly keyboardRepo;
  private readonly keyService;
  private readonly designkeyboardService;
  private readonly membershipStatusService;
  constructor(
    keyboardRepo: KeyboardRepository,
    keyService: KeyService,
    membershipStatusService: MembershipStatusService,
    designkeyboardService: DesignKeyboardService
  ) {
    this.keyboardRepo = keyboardRepo;
    this.keyService = keyService;
    this.membershipStatusService = membershipStatusService;
    this.designkeyboardService = designkeyboardService;
  }

  async allByUserWithKeysOrError(
    userId: number,
    categories: string[] | undefined = undefined
  ) {
    const keyboards = await this.keyboardRepo.findManyByUserId(
      userId,
      categories
    );
    //get the keys with soundUrl nested
    const keyboardsWithKeySoundUrl = await Promise.all(
      keyboards.map(async (keyboard) => {
        const keys = await this.keyService.allByUserOrError(
          userId,
          keyboard.id
        );

        return {
          ...keyboard,
          keys: keys,
        };
      })
    );
    return keyboardsWithKeySoundUrl;
  }
  async allByUserOrError(
    userId: number,
    categories: string[] | undefined = undefined,
    limit: number = 5
  ) {
    const keyboards = await this.keyboardRepo.findManyByUserId(
      userId,
      categories,
      limit
    );

    return keyboards;
  }
  async getOneByIdOrError(id: number, userId: number) {
    const keyboard = await this.getKeyboardIfUserIsAuthOrError(id, userId);

    const keys = await this.keyService.allByUserOrError(userId, keyboard.id);
    const design = await this.designkeyboardService.getOneOrError(
      keyboard.design_keyboardName ||
        getRandomValueFromArray(config.design.free.names)
    );
    return {
      ...keyboard,
      keys: keys.sort((a, b) => a.order - b.order),
      design,
    };
  }
  async getKeyboardIfUserIsAuthOrError(
    id: number | undefined,
    userId: number | undefined
  ) {
    if (!id || !userId)
      throw new EntityNotFoundError("Key Id or userId is missing", {}, 404);

    const keyboardToCheck = await this.keyboardRepo.findById(id);
    if (!keyboardToCheck)
      throw new EntityNotFoundError(`keyboard with ${id} id not found`, {});
    if (keyboardToCheck.userId !== userId) {
      throw new AuthorizationError(
        "This is user is not authorized to do this keyboard operation",
        {}
      );
    }
    return keyboardToCheck;
  }

  async createOrError({
    userId,
    name,
    design_keyboardName,
    keys,
    categories,
  }: keyboardToCreateWithKeysAndCategories) {
    //check the user membershipStatus if exceed its limits
    await this.membershipStatusService.errorIfUserExceedMembership(userId, {
      increaseKeyboards: 1,
    });
    const keyboardCreated = await this.keyboardRepo.create(
      {
        name,
        userId,
        design_keyboardName:
          design_keyboardName ||
          getRandomValueFromArray(config.design.free.names),
      },
      keys ? keys : [],
      categories ? categories : []
    );
    if (!keyboardCreated) {
      throw new UnknowDbError("Error creating keyboard");
    }
    //assign default effects(volumen...)
    KeyboardListener.emit(KeyboardListener.events.Create, {
      userId,
      keyboard: keyboardCreated,
    });
    return keyboardCreated;
  }
  async updateOrError(
    id: number,
    {
      userId,
      name,
      design_keyboardName,
      keys,
      keysToDelete,
      categories,
      categoriesToDelete,
    }: keyboardToUpdateeWithKeysAndCategories
  ) {
    const keyboardToUpdate = await this.keyboardRepo.findById(id);
    if (!keyboardToUpdate) {
      throw new EntityNotFoundError(
        `Error: keyboard with ${id} id not found`,
        {}
      );
    }
    const keyboardCreated = await this.keyboardRepo.update(
      id,
      {
        name: name ?? keyboardToUpdate.name,
        userId,
        design_keyboardName:
          design_keyboardName ||
          keyboardToUpdate.design_keyboardName ||
          getRandomValueFromArray(config.design.free.names),
      },
      keys,
      keysToDelete ? keysToDelete : [],
      categories ? categories : [],
      categoriesToDelete ? categoriesToDelete : []
    );
    if (!keyboardCreated) {
      throw new UnknowDbError("Error creating keyboard");
    }
    return keyboardCreated;
  }
  async deleteOrError(id: number) {
    const keyboardToDelete = await this.keyboardRepo.findById(id);
    if (!keyboardToDelete) {
      throw new EntityNotFoundError(
        "Error trying to delete a keyboard with id " + id,
        {
          keyboard: `Keyboard with id ${id} not found`,
        }
      );
    }
    const result = await this.keyboardRepo.deleteById(id);

    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting keyboard with ${id} id`,
        {},
        404
      );
    }
    KeyboardListener.emit(KeyboardListener.events.Delete, {
      userId: keyboardToDelete.userId,
      keyboardDeleted: keyboardToDelete,
    });
    return result;
  }
}
