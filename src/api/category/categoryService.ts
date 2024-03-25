import { EntityNotFoundError } from "../../errors/db/db.js";
import categoryRepository from "./categoryRepository.js";
export default class CategoryService {
  constructor(private readonly categoryRepo: categoryRepository) {}

  //This function must only be called when user is register by the first time
  async getByIdOrError(id: number) {
    const membership = await this.categoryRepo.findFirstById(id);
    if (!membership) {
      throw new EntityNotFoundError(
        `Membership with id ${id} not found`,
        {},
        500
      );
    }
    return membership;
  }
  async findByNameOrCreate(name: string | undefined) {
    const categoryName = name || "default";

    const category =
      (await this.categoryRepo.findFirstWhere({ name: categoryName })) ||
      (await this.categoryRepo.createByName(categoryName));
    return category;
  }
}
