import path from "path";
import { EntityNotFoundError } from "../../errors/db/db.js";
import StorageService from "../../services/logger/storage/storage.js";
import { S3File } from "../../types/index.js";

import SoundRepository from "./soundRepository.js";
import { soundToCreate } from "./types.js";
import { randomString } from "../../utils/utils.js";
import { StorageError } from "../../errors/general/general.js";
import { Sound } from "@prisma/client";
import { AuthorizationError } from "../../errors/auth/auth.js";

type SoundRequestData = {
  folder?: string;
};
interface soundWithUrl extends Sound {
  soundUrl: string;
}
export default class SoundService {
  private SoundRepo;
  constructor(
    SoundRepo: SoundRepository,
    private readonly storage: StorageService
  ) {
    this.SoundRepo = SoundRepo;
  }

  async allByUserOrError(userId: number | undefined) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const sounds = await this.SoundRepo.findManyByUserId(userId);
    const soundsWithAudioUrl: soundWithUrl[] = await Promise.all(
      sounds.map(async (sound) => {
        let url = "";
        if (sound.path) {
          url = await this.getAudioFileUrl(sound.path);
        }
        return { ...sound, soundUrl: url };
      })
    );

    return soundsWithAudioUrl;
  }
  async getOneByIdOrError(id: number) {
    const sound = await this.SoundRepo.findById(id);
    if (!sound)
      throw new EntityNotFoundError(`Sound with ${id} id not found`, {});
    return sound;
  }
  async deleteSoundByIdOrError(
    id: number | undefined,
    userId: number | undefined
  ) {
    if (!id || !userId)
      throw new EntityNotFoundError(
        "Error deleting sound sound id or user id is missing",
        {},
        404
      );
    //get the audio attempting to delete
    const soundTodelete = await this.getOneByIdOrError(id);
    if (soundTodelete.userId !== userId) {
      throw new AuthorizationError(
        "This is user is not authorized to delete this sound",
        {}
      );
    }
    //delete audio from S3
    if (soundTodelete.path) {
      const resultAudioDeleted = await this.deleteAudioFileOrError(
        soundTodelete.path
      );
      console.log("RESULT OF DELETING SOUND:", resultAudioDeleted);
    }

    const result = await this.SoundRepo.deleteById(id);

    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting Sound with ${id} id`,
        {},
        404
      );
    }
    return result;
  }
  async createOrError() {}

  async getAudioFileUrl(sound: string) {
    try {
      const url = await this.storage.get(sound);
      return url;
    } catch (error) {
      console.log(
        "Error fetching avatar URL " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        "Error fetching avatar URL " +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
  async storeAudioFileOrError(soundFile: S3File) {
    try {
      const result = await this.storage.store(soundFile);
      console.log("RESULT OF STORING SOUND", result);
      return result;
    } catch (error) {
      console.log(
        "Error uploading avatar file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        `Error uploading SOUND file` +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
  async deleteAudioFileOrError(sound: string) {
    const result = await this.storage.delete(sound);
    return result;
  }

  async createManyOrError(
    files: Express.Multer.File[],
    userId: number | undefined,
    requestData: SoundRequestData
  ) {
    const folderS3 = requestData.folder || "no-categorized";
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const soundsToCreate: soundToCreate[] = await Promise.all(
      files.map(async (file) => {
        const key = `user-${userId}/sounds/${folderS3}/${randomString()}`;
        await this.storeAudioFileOrError({
          key,
          body: file.buffer,
          contentType: file.mimetype,
        });
        return {
          userId,
          name: path.parse(file.originalname).name,
          path: key,
        };
      })
    );

    const sounds = await this.SoundRepo.createMany(soundsToCreate);
    return sounds;
  }
}
