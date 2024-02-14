import { EntityNotFoundError, UnknowDbError } from "../../errors/db/db.js";
import { keyToCreate, keyToUpdate } from "./types.js";
import { Key } from "@prisma/client";
import { AuthorizationError } from "../../errors/auth/auth.js";
import KeyRepository from "./keyRepository.js";
import SoundService from "../sound/soundService.js";

interface KeyTocreateWithFile extends keyToCreate {
  soundFile: Express.Multer.File | undefined;
}
interface KeyToupdateWithFile extends keyToUpdate {
  soundFile: Express.Multer.File | undefined;
}


export default class KeyService {
  private readonly keyRepo;
  private readonly soundService;
  constructor(keyRepo: KeyRepository, soundService: SoundService) {
    this.keyRepo = keyRepo;
    this.soundService = soundService;
  }

  async allByUserOrError(userId: number | undefined) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const keys = await this.keyRepo.findManyByUserId(userId);
    const keysWithSoundAndSoundUrl: Key[] = await Promise.all(
      keys.map(async (key) => {
        let url = "";
        const { sound } = key;
        if (!sound) return { ...key, sound: null };
        if (sound.path) {
          url = await this.soundService.getAudioFileUrlOrError(sound.path);
        }
        return { ...key, sound: { ...sound, soundUrl: url } };
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
    soundFile,
    soundId,
    letter,
    design_keyId,
  }: KeyTocreateWithFile) {
    if (soundFile) {
      const soundCreated = await this.soundService.createOrError(soundFile, {
        userId: userId,
      });
      soundId = soundCreated.id;
    }
    if (soundId && !soundFile) {
      const soundExist = await this.soundService.getOneByIdOrError(soundId);
      soundId = soundExist.id;
    }
    const keyCreated = await this.keyRepo.create({
      userId,
      soundId,
      letter: letter.toLowerCase(),
      design_keyId,
    });
    if (!keyCreated) {
      throw new UnknowDbError("Error creating key");
    }
    return keyCreated;
  }
  async updateOrError(
    id: number,
    { soundFile, soundId, letter, userId, design_keyId }: KeyToupdateWithFile
  ) {
    if (soundFile) {
      const soundCreated = await this.soundService.createOrError(soundFile, {
        userId: userId,
      });
      soundId = soundCreated.id;
    }
    if (soundId && !soundFile) {
      const soundExist = await this.soundService.getOneByIdOrError(soundId);
      soundId = soundExist.id;
    }
    const keyUpdated = await this.keyRepo.update(id, {
      soundId,
      letter: letter?.toLowerCase(),
      userId,
      design_keyId,
    });
    if (!keyUpdated) {
      throw new UnknowDbError("Error updating key");
    }
    return keyUpdated
  }
  async deleteOrError(id: number) {
    const result = await this.keyRepo.deleteById(id);

    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting Sound with ${id} id`,
        {},
        404
      );
    }

    return result;
  }
}
