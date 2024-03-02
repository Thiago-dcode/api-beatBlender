import { PrismaClient } from "@prisma/client";

import { keyboardToCreate, keyboardToUpdate } from "./types.js";
import config from "../../config/config.js";

export default class KeyboardRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async findManyByUserId(
    userId: number,
    categoriesArr: string[] | undefined = undefined,
    limit: number | undefined = undefined
  ) {
    let categories = {};
    if (categoriesArr) {
      categories = {
        some: {
          name: {
            in: categoriesArr.map((category) => category),
          },
        },
      };
    }

    return await this.db.keyboard.findMany({
      take: limit,
      where: {
        userId,
        categories,
        private: false,
      },
      include: { categories: true, effects: true },
    });
  }
  async findById(id: number) {
    const keyboard = await this.db.keyboard.findFirst({
      where: { id },
      include: { categories: true, effects: true },
    });
    return keyboard;
  }

  async create(
    keyboardData: keyboardToCreate,
    keys: number[] | [] = [],
    categories: string[] | [] = []
  ) {
    const keyboard = await this.db.keyboard.create({
      data: {
        ...keyboardData,
        keys: {
          connect: keys.map((key) => {
            return { id: key };
          }),
        },
        categories: {
          connectOrCreate: categories.map((category) => {
            return { create: { name: category }, where: { name: category } };
          }),
        },
        effects: {
          create: config.effects
            .filter((ef) => {
              ef.keyboards;
            })
            .map(({ name, description, config, isActive }) => {
              return {
                name,
                description,
                config,
                isActive,
              };
            }),
        },
      },
    });
    return keyboard;
  }
  async update(
    id: number,
    keyboardData: keyboardToUpdate,
    keys: number[] = [],
    keysToDelete: number[] = [],
    categories: string[] = [],
    categoriesToDelete: string[] = []
  ) {
    const result = await this.db.keyboard.update({
      where: { id },
      data: {
        ...keyboardData,
        keys: {
          connect: keys.map((key) => {
            return { id: key };
          }),
          disconnect: keysToDelete.map((key) => {
            return { id: key };
          }),
        },
        categories: {
          connectOrCreate: categories.map((category) => {
            return { create: { name: category }, where: { name: category } };
          }),
          disconnect: categoriesToDelete.map((category) => {
            return { name: category };
          }),
        },
      },
    });
    return result;
  }
  async deleteById(id: number) {
    const result = await this.db.keyboard.delete({
      where: { id },
    });
    return result;
  }
}
