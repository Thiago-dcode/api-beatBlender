import config from "../../config/config.js";
import { EntityNotFoundError } from "../../errors/db/db.js";
import { DataMissingError } from "../../errors/general/general.js";
import StorageService from "../../services/storage/storage.js";
import DesignKeyboardRepository from "./designKeyboardRepository.js";

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
    const path = `${isPremium ? premium.path : free.path}/${name}.css`;
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
  async getOneOrError(name: string) {
    const design = await this.designKeyboardRepo.findByName(name);
    if (!design) {
      throw new EntityNotFoundError(`Design keyboard (${name}) not found`, {});
    }
    // get the css file from s3
    const designUrl = await this.storage.getUrl(design.path);
    return {
      ...design,
      designUrl,
    };
  }
  async getAllOrError() {
    const designs = await this.designKeyboardRepo.findMany();
    if (!designs) {
      throw new EntityNotFoundError(`Design keyboards not found`, {});
    }
    // get the css file from s3

    const designWithUrl = await Promise.all(
      designs.map(async (design) => {
        const designUrl = await this.storage.getUrl(design.path, 1800);
        return {
          ...design,
          designUrl,
        };
      })
    );

    return designWithUrl;
  }
}
