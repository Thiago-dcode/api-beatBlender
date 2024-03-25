import { PrismaClient } from "@prisma/client";

import { keyToCreate, keyToUpdate } from "./types.js";
import config from "../../config/config.js";

export default class KeyRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async findManyByUserId(
    userId: number,
    keyboardId: number | undefined = undefined
  ) {
    let keyboard = {};
    if (keyboardId) {
      keyboard = { some: { id: keyboardId } };
    }
    return await this.db.key.findMany({
      where: {
        userId,
        keyboard,
      },
      include: { sound: true, effects: true, category: true },
    });
  }
  async update(id: number, data: keyToUpdate, categoryId: number | undefined) {
    const result = await this.db.key.update({
      where: { id },
      data: {
        ...data,
        categoryId,
      },
    });
    return result;
  }

  async create(data: keyToCreate, categoryId: number) {
    const result = await this.db.key.create({
      data: {
        ...data,
        categoryId,
        name: data.name || "",
        displayName: data.displayName || data.key.toLowerCase(),
        effects: {
          create: config.effects
            .filter((ef) => ef.keys)
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
      include: { effects: true, category: true },
    });
    return result;
  }
  async findById(id: number) {
    const key = await this.db.key.findFirst({
      where: { id },
      include: { sound: true, effects: true, category: true },
    });
    return key;
  }
  async deleteById(id: number) {
    const result = await this.db.key.delete({
      where: { id },
    });
    return result;
  }
}
