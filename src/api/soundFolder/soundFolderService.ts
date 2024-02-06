import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
} from "../../errors/db/db.js";
import SoundFolderRepository from "./soundFolderRepository.js";

export default class SoundFolderService {
  private readonly soundFolderRepo;
  constructor(soundFolderRepo: SoundFolderRepository) {
    this.soundFolderRepo = soundFolderRepo;
  }
  async allByUserOrError(userId: number | undefined) {
    if (!userId) throw new EntityNotFoundError("User not found", {});
    const soundFolders = await this.soundFolderRepo.findManyByUserId(userId);
    return soundFolders;
  }
  async getByNameOrCreateOrError(name: string, userId: number) {
    const soundFolder = await this.soundFolderRepo.findFirstWhere({
      name,
      userId,
    });
    if (!soundFolder) {
      const soundFolderCreated = await this.soundFolderRepo.create({
        name,
        isDefault: false,
        userId,
      });
      return soundFolderCreated;
    }

    return soundFolder;
  }
  async getOrCreateDefaultFolderByUserId(userId: number) {
    const defaultFolderExist = await this.soundFolderRepo.findFirstWhere({
      isDefault: true,
      userId,
    });
    if (!defaultFolderExist) {
      const defaultFolderCreated = await this.soundFolderRepo.create({
        name: "default",
        isDefault: true,
        userId,
      });
      return defaultFolderCreated;
    }
    return defaultFolderExist;
  }
  async getByIdOrError(id: number) {
    const soundFolder = await this.soundFolderRepo.findById(id);
    if (!soundFolder)
      throw new EntityNotFoundError(
        `No folder found with the ID ${id} provided`,
        {}
      );
    return soundFolder;
  }


  async updateWithUniqueNameOrError(id: number, name: string) {
    const folderExist = await this.soundFolderRepo.findById(id);

    if (folderExist) {
      throw new EntityAlreadyExistsError(
        "Already exist a folder with this name",
        {
          name: "Already exist a folder with this name",
        }
      );
    }

    const folderUpdated = await this.soundFolderRepo.update(id, {
      name,
      isDefault: false,
    });
  }
}
