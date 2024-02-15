import { PrismaClient } from "@prisma/client";

import { keyToCreate, keyToUpdate } from "./types.js";

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
      include: { sound: true },
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
    const result = await this.db.key.create({ data });
    return result;
  }
  async findById(id: number) {
    const key = await this.db.key.findFirst({
      where: { id },
      include: { sound: true },
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
