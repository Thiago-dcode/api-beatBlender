import path from "path";
import { EntityNotFoundError } from "../../errors/db/db.js";
import StorageService from "../../services/logger/storage/storage.js";
import { S3File } from "../../types/index.js";

import SoundRepository from "./soundRepository.js";
import { soundToCreate } from "./types.js";
import { randomString } from "../../utils/utils.js";
import { StorageError } from "../../errors/general/general.js";
import { Sound, Sound_folder } from "@prisma/client";
import { AuthorizationError } from "../../errors/auth/auth.js";
import { extractFolderAndFileName } from "./helper.js";
import SoundFolderService from "../soundFolder/soundFolderService.js";

type SoundRequestData = {
  folderId?: number;
  name?: string;
  userId: number;
};
interface soundWithUrl extends Sound {
  soundUrl: string;
}
export default class SoundService {
  private SoundRepo;
  constructor(
    SoundRepo: SoundRepository,
    private readonly storage: StorageService,
    private readonly soundFolderService: SoundFolderService
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
          url = await this.getAudioFileUrlOrError(sound.path);
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

    const url = await this.getAudioFileUrlOrError(sound.path);

    return { ...sound, soundUrl: url };
  }
  async getSoundIfUserIsAuthOrError(
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
    const soundToCheck = await this.getOneByIdOrError(id);
    if (soundToCheck.userId !== userId) {
      throw new AuthorizationError(
        "This is user is not authorized to do this sound operation",
        {}
      );
    }
    return soundToCheck;
  }

  async createManyOrError(
    files: Express.Multer.File[],
    requestData: SoundRequestData
  ) {
    const { folderId, userId } = requestData;
    const soundFolder = folderId
      ? await this.soundFolderService.getByIdIfUserIsAuthOrError(
          folderId,
          userId
        )
      : await this.soundFolderService.getOrCreateDefaultFolderByUserId(userId);

    const soundsToCreate: soundToCreate[] = await Promise.all(
      files.map(async (file) => {
        const fileName = randomString();
        const key = `user-${requestData.userId}/sounds/${soundFolder.name}/${fileName}`;
        await this.storeAudioFileOrError({
          key,
          body: file.buffer,
          contentType: file.mimetype,
        });
        return {
          userId: requestData.userId,
          name: path.parse(file.originalname).name,
          path: key,
          sound_folderId: soundFolder.id,
        };
      })
    );
    const sounds = await this.SoundRepo.createMany(soundsToCreate);
    return sounds;
  }
  async updateOrError(
    id: number,
    { folderId, userId, name }: SoundRequestData,
    soundFile: Express.Multer.File | undefined
  ) {
    const soundToUpdate = await this.getSoundIfUserIsAuthOrError(id, userId);

    const { filename: previousFilename, foldername: previousFoldername } =
      extractFolderAndFileName(soundToUpdate.path);

    const folder = folderId
      ? await this.soundFolderService.getByIdIfUserIsAuthOrError(
          folderId,
          userId
        )
      : null;
    let path = soundToUpdate.path;
    if (soundFile || folder?.id !== soundToUpdate.sound_folderId) {
      if (folder && !soundFile) {
        //update just the folder of the sound
        //build the path with the new folder.
        path = `user-${soundToUpdate.userId}/sounds/${folder.name}/${previousFilename}`;
        //move the file to the new folder provided
        await this.moveAudioFileOrError(soundToUpdate.path, path);
      } else if (soundFile) {
        await this.deleteAudioFileOrError(soundToUpdate?.path);
        const filename = randomString();
        path = folder
          ? `user-${soundToUpdate.userId}/sounds/${folder.name}/${filename}`
          : `user-${soundToUpdate.userId}/sounds/${previousFoldername}/${filename}`;
        const s3File: S3File = {
          key: path,
          body: soundFile.buffer,
          contentType: soundFile.mimetype,
        };

        await this.storeAudioFileOrError(s3File);
      }
    }

    const soundUpdated = await this.SoundRepo.update(id, {
      name: name || soundToUpdate.name || soundFile?.originalname,
      path,
      sound_folderId: folder?.id || soundToUpdate.sound_folderId,
    });
    return {
      ...soundUpdated,
      soundUrl: await this.getAudioFileUrlOrError(path),
    };
  }
  async deleteSoundByIdOrError(
    id: number | undefined,
    userId: number | undefined
  ) {
    const soundTodelete = await this.getSoundIfUserIsAuthOrError(id, userId);
    //delete audio from S3
    if (soundTodelete.path) {
      const resultAudioDeleted = await this.deleteAudioFileOrError(
        soundTodelete.path
      );
      console.log("RESULT OF DELETING SOUND:", resultAudioDeleted);
    }
    if (!id) throw new EntityNotFoundError("Sound id not provided", {});
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
  async getAudioFileUrlOrError(sound: string) {
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
        "Error uploading SOUND file " +
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
  async moveAudioFileOrError(from: string, to: string) {
    try {
      console.log("{from,to}", { from, to });
      const result = await this.storage.move(from, to);

      return result;
    } catch (error) {
      console.log(
        "Error MOVING SOUND file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        `Error MOVING SOUND file` +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
  async deleteAudioFileOrError(sound: string) {
    try {
      const result = await this.storage.delete(sound);
      return result;
    } catch (error) {
      console.log(
        "Error error Deleting SOUND file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        `Error error Deleting SOUND file` +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
}
