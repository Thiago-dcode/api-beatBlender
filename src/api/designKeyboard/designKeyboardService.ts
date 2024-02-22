import config from "../../config/config.js";
import { EntityNotFoundError } from "../../errors/db/db.js";
import { DataMissingError } from "../../errors/general/general.js";
import StorageService from "../../services/logger/storage/storage.js";
import KeyService from "../key/keyService.js";
import KeyBoardService from "../keyboard/keyboardService.js";
import DesignKeyboardRepository from "./designKeyboardRepository.js";
import { designKeyboardToCreate, designKeyboardToUpdate } from "./types.js";

export default class DesignKeyboardService {
  constructor(
    private readonly designKeyboardRepo: DesignKeyboardRepository,
    private readonly storage: StorageService
  ) {}

  async createOrError(
    {
      name,
      colors,
      isPremium,
    }: {
      name: string;
      colors: string[];
      isPremium?: boolean;
    },
    file: Express.Multer.File | undefined
  ) {
    if (!file) {
      throw new DataMissingError("Not css file provided", {});
    }
    const { premium, free } = config.design;
    const path = `${isPremium ? premium.path : free.path}/${name}`;
    const designCreated = await this.designKeyboardRepo.create({
      name,
      colors,
      isPremium,
      path,
    });
    //store the css file from s3
    const result = await this.storage.store({
      body: file.buffer,
      key: path,
      contentType: file.mimetype,
    });

    return designCreated;
  }
  async getOneOrError(id: number) {
    const design = await this.designKeyboardRepo.findById(id);
    if (!design) {
      throw new EntityNotFoundError("Design keyboard not found", {});
    }
    // get the css file from s3
    const designUrl = await this.storage.get(design?.path);
    return {
      ...design,
      designUrl,
    };
  }
}
