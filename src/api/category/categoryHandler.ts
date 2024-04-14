import { NextFunction, Request, Response } from "express";
import CategoryService from "./categoryService.js";

class CategoryHandler {
  constructor(private readonly categoryService: CategoryService) {
    this.index = this.index.bind(this);
  }
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req?.query?.filter;
      const categories = await this.categoryService.getAll(
        typeof filter === "string" ? filter : undefined
      );

      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
}

export default CategoryHandler;
