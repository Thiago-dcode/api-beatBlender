//CategoryFacade.ts
import { db } from "../../db/db.js";

import CategoryService from "../../api/category/categoryService.js";
import categoryRepository from "../../api/category/categoryRepository.js";
/**
 * Facade for interacting with KEY-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
console.log("CATEGORY FOLDER FACADE");
class CategoryFacade {
  /**
   * Constructs a new instance of CategoryFacade.
   * @param CategoryService The key service to be used.
   */
  constructor(readonly categoryService: CategoryService) {}
}

let singleton: CategoryFacade;

export default () => {
  if (!(singleton instanceof CategoryFacade)) {
    singleton = new CategoryFacade(
      new CategoryService(new categoryRepository(db()))
    );
  }
  return singleton;
};
