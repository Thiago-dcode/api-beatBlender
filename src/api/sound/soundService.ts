import { Sound } from "@prisma/client";
import { EntityNotFoundError } from "../../errors/db/db.js";
import StorageService from "../../services/logger/storage/storage.js";
import { S3File } from "../../types/index.js";

import SoundRepository from "./soundRepository.js";
import { soundToCreate } from "./types.js";
import { randomString } from "../../utils/utils.js";

export default class SoundService {
  private SoundRepo;
  constructor(SoundRepo: SoundRepository, storage: StorageService) {
    this.SoundRepo = SoundRepo;
  }

  async allByUserOrError(userId: number | undefined) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const sounds = await this.SoundRepo.findManyByUserId(userId);
    return sounds;
  }
  async createOrError() {}
  async storeSoundOrError(soundFile: S3File) {

    
  }

  async createManyOrError(
    files: Express.Multer.File[],
    userId: number | undefined,
    folder: string | undefined
  ) {
    const folderS3 = folder || "no-categorized";
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const soundsToCreate: soundToCreate[] = await Promise.all(
      files.map(async (file) => {
    
        const path = `user-${userId}/sounds/${folderS3}/`;
        await this.storeSoundOrError({
          key: `user-${userId}/sounds/${folderS3}/${randomString()}`,
          body: file.buffer,
          contentType: file.mimetype,
        });
        return {
          userId,
          name: file.filename,
          path,
        };
      })
    );

    const sounds = await this.SoundRepo.createMany(soundsToCreate);
  }
}
