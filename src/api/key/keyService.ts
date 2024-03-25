import { EntityNotFoundError, UnknowDbError } from "../../errors/db/db.js";
import { keyToCreate, keyToUpdate } from "./types.js";
import { Key, Sound } from "@prisma/client";
import { AuthorizationError } from "../../errors/auth/auth.js";
import KeyRepository from "./keyRepository.js";
import SoundService from "../sound/soundService.js";
import EffectService from "../effect/effectService.js";
import { truncateString } from "../../utils/utils.js";
import CategoryService from "../category/categoryService.js";

interface KeyTocreateWithFile extends keyToCreate {
  soundFile: Express.Multer.File | undefined;
  category?: string;
}
interface KeyToupdateWithFile extends keyToUpdate {
  soundFile: Express.Multer.File | undefined;
  category?: string;
}

export default class KeyService {
  private readonly keyRepo;
  private readonly soundService;
  private readonly categoryService;

  constructor(
    keyRepo: KeyRepository,
    soundService: SoundService,
    categoryService: CategoryService
  ) {
    this.keyRepo = keyRepo;
    this.soundService = soundService;
    this.categoryService = categoryService;
  }

  async allByUserOrError(
    userId: number | undefined,
    keyboardId: number | undefined = undefined
  ) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const keys = await this.keyRepo.findManyByUserId(userId, keyboardId);
    console.log(keys[0]);
    const keysWithSoundAndSoundUrl: Key[] = await Promise.all(
      keys.map(async (key) => {
        let url = "";
        const { sound } = key;

        if (!sound) return { ...key, sound: null };
        if (sound.path) {
          url = await this.soundService.getAudioFileUrlOrError(sound.path);
        }
        return {
          ...key,
          sound: { ...sound, soundUrl: url },
        };
      })
    );

    return keysWithSoundAndSoundUrl;
  }

  async getOneByIdOrError(id: number, userId: number) {
    const key = await this.getKeyIfUserIsAuthOrError(id, userId);
    let url = "";
    const { sound } = key;
    if (sound) {
      url = await this.soundService.getAudioFileUrlOrError(sound.path);
    }

    return { ...key, sound: { ...sound, soundUrl: url } };
  }
  async getKeyIfUserIsAuthOrError(
    id: number | undefined,
    userId: number | undefined
  ) {
    if (!id || !userId)
      throw new EntityNotFoundError("Key Id or userId is missing", {}, 404);

    const keyToCheck = await this.keyRepo.findById(id);
    if (!keyToCheck)
      throw new EntityNotFoundError(`key with ${id} id not found`, {});
    if (keyToCheck.userId !== userId) {
      throw new AuthorizationError(
        "This is user is not authorized to do this key operation",
        {}
      );
    }
    return keyToCheck;
  }

  async createOrError({
    userId,
    name,
    soundFile,
    soundId,
    key,
    displayName,
    bgColor,
    keyColor,
    category,
    order,
  }: KeyTocreateWithFile) {
    //handle sound
    let sound: Sound | undefined = undefined;
    if (soundFile) {
      const soundCreated = await this.soundService.createOrError(soundFile, {
        userId: userId,
      });
      soundId = soundCreated.id;
    }

    if (soundId && !sound) {
      sound = await this.soundService.getOneByIdOrError(soundId);
      soundId = sound.id;
    }
    //handle category
    const { id: categoryId } = await this.categoryService.findByNameOrCreate(
      category
    );
    //handle name
    if (sound && !name) name = truncateString(sound.name);
    const keyCreated = await this.keyRepo.create(
      {
        userId,
        name,
        soundId,
        key: key.toLowerCase(),
        displayName,
        bgColor,
        keyColor,
        order: order || 999,
      },
      categoryId
    );
    //assign default effects
    if (!keyCreated) {
      throw new UnknowDbError("Error creating key");
    }
    return keyCreated;
  }
  async updateOrError(
    id: number,
    {
      soundFile,
      soundId,
      key,
      displayName,
      userId,
      category,
      name,
      design_keyId,
    }: KeyToupdateWithFile
  ) {
    // 1: Check if exist a key
    const keyToUpdate = await this.keyRepo.findById(id);
    if (!keyToUpdate) {
      throw new EntityNotFoundError(`key with ${id} id not found`, {});
    }
    //2: If a sound file is given, create one a assign the soundId
    let sound: Sound | undefined = undefined;
    if (soundFile) {
      const soundCreated = await this.soundService.createOrError(soundFile, {
        userId: userId,
      });
      soundId = soundCreated.id;
    }
    //3: If a sound file is NOT given, get one a assign the soundId
    if (soundId && !sound) {
      sound = await this.soundService.getOneByIdOrError(soundId);
      soundId = sound.id;
    }
    //4: handle category
    const { id: categoryId } = await this.categoryService.findByNameOrCreate(
      category || keyToUpdate.category?.name
    );

    const keyUpdated = await this.keyRepo.update(
      id,
      {
        name: name || keyToUpdate.name,
        soundId,
        key: key?.toLowerCase() || keyToUpdate.key,
        userId,
        displayName,
        design_keyId,
      },
      categoryId
    );
    if (!keyUpdated) {
      throw new UnknowDbError("Error updating key");
    }
    return keyUpdated;
  }
  async deleteOrError(id: number) {
    const result = await this.keyRepo.deleteById(id);

    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting Key with ${id} id`,
        {},
        404
      );
    }

    return result;
  }
}
