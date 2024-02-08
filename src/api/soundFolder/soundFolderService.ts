import { AuthorizationError } from "../../errors/auth/auth.js";
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
} from "../../errors/db/db.js";
import { StorageError } from "../../errors/general/general.js";
import StorageService from "../../services/logger/storage/storage.js";
import { extractFolderAndFileName } from "./helper.js";
import SoundFolderRepository from "./soundFolderRepository.js";

export default class SoundFolderService {
  private readonly soundFolderRepo;
  constructor(
    soundFolderRepo: SoundFolderRepository,
    private readonly storage: StorageService
  ) {
    this.soundFolderRepo = soundFolderRepo;
  }
  async allByUserOrError(userId: number | undefined) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const soundFolders = await this.soundFolderRepo.findManyByUserId(userId);
    return soundFolders;
  }
  async getIfExistOrDefaultOrError(id: number | undefined, userId: number) {
    const folder = id
      ? await this.getByIdIfUserIsAuthOrError(id, userId, false)
      : await this.getOrCreateDefaultFolderByUserId(userId);
    return folder;
  }
  async getByIdIfUserIsAuthOrError(
    id: number,
    userId: number,
    includeSounds = true
  ) {
    const soundFolder = await this.soundFolderRepo.findByIdWithSounds(
      id,
      includeSounds
    );
    if (!soundFolder)
      throw new EntityNotFoundError(
        `No folder found with the ID ${id} provided`,
        {}
      );
    if (soundFolder.userId !== userId)
      throw new AuthorizationError(
        `User is not allowed to do this operation`,
        {}
      );
    //Url
    const soundsWithUrl = await Promise.all(
      soundFolder.sounds.map(async (sound) => {
        const soundUrl = await this.storage.get(sound.path);
        return { ...sound, soundUrl };
      })
    );
    return {
      ...soundFolder,
      sounds: soundsWithUrl,
    };
  }
  async getByNameOrCreateOrError(name: string, userId: number) {
    const soundFolder = await this.soundFolderRepo.findFirstWhere({
      name,
      userId,
    });

    if (!soundFolder) {
      const soundFolderCreated = await this.soundFolderRepo.create({
        name,
        is_default: false,
        userId,
      });
      return soundFolderCreated;
    }

    return soundFolder;
  }
  async getOrCreateDefaultFolderByUserId(userId: number) {
    const defaultFolderExist = await this.soundFolderRepo.findFirstWhere({
      is_default: true,
      userId,
    });
    if (!defaultFolderExist) {
      const defaultFolderCreated = await this.soundFolderRepo.create({
        name: "default",
        is_default: true,
        userId,
      });
      return defaultFolderCreated;
    }
    return defaultFolderExist;
  }

  async updateWithUniqueNameOrError(id: number, name: string, userId: number) {
    const folderExist = await this.getByIdIfUserIsAuthOrError(id, userId, true);
  
    if (folderExist.name === name) {
      return folderExist;
    }
 
    if (folderExist.sounds.length > 0) {
     
      const from = `user-${userId}/sounds/${folderExist.name}`;
      const to = `user-${userId}/sounds/${name}`;
      await this.moveSoundFolderFileOrError(from, to);
      //emit event to upload the audios
      


    }
    const folderUpdated = await this.soundFolderRepo.update(id, {
      name,
      is_default: false,
    });
    return folderUpdated;
  }

  async deleteSoundFolderOrError(id: number, userId: number) {
    const soundFolderToDelete = await this.getByIdIfUserIsAuthOrError(
      id,
      userId
    );
    //delete folder from S3 if it has sounds
    if (soundFolderToDelete.sounds.length > 0) {
      const folderPath = `user-${userId}/sounds/${soundFolderToDelete.name}`;
      const resultOfDeleting = await this.deleteSoundFolderFileOrError(
        folderPath
      );
    }

    //delete folder from db
    const result = await this.soundFolderRepo.deleteById(id);
    if (!result) {
      throw new EntityNotFoundError(
        `Error deleting Sound with ${id} id`,
        {},
        404
      );
    }
    return result;
  }
  async moveSoundFolderFileOrError(from: string, to: string) {
    try {
      const result = await this.storage.moveManyByFolder(
        from,
        to,
        extractFolderAndFileName
      );

      return result;
    } catch (error) {
      console.log(
        "Error moving many SOUNDFOLDER file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        `Error moving many SOUNDFOLDER file` +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
  async deleteSoundFolderFileOrError(folder: string) {
    try {
      const result = await this.storage.deleteManyByFolder(folder);

      return result;
    } catch (error) {
      console.log(
        "Error error Deleting SOUNDFOLDER file " +
          (error instanceof Error ? error.message : "")
      );
      throw new StorageError(
        `Error error Deleting SOUNDFOLDER file` +
          (error instanceof Error ? error.message : ""),
        {},
        500
      );
    }
  }
}
