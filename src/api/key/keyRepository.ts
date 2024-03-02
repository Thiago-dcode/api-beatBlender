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
      include: { sound: true, effects: true },
    });
  }
  async update(id: number, data: keyToUpdate) {
    const result = await this.db.key.update({
      where: { id },
      data,
    });
    return result;
  }

  async create(data: keyToCreate) {
    const result = await this.db.key.create({
      data: {
        ...data,
        effects: {
          create: config.effects
            .filter((ef) => {
              ef.keys;
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
    return result;
  }
  async findById(id: number) {
    const key = await this.db.key.findFirst({
      where: { id },
      include: { sound: true, effects: true },
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
