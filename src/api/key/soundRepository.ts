import { Prisma, PrismaClient, Sound } from "@prisma/client";
import { UnknowDbError } from "../../errors/db/db.js";
import { soundToCreate, soundToUpdate } from "./types.js";

export default class KeyRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async findManyByUserId(userId: number) {
    return await this.db.sound.findMany({
      where: {
        userId,
      },
    });
  }
  async update(id: number, data: soundToUpdate) {
    const result = await this.db.sound.update({
      where: { id },
      data,
    });
    return result;
  }
  async updateMany(userId: number, data: soundToUpdate[]) {
   const result =  await this.db.sound.updateMany({
      where: { userId },
      data,
    });
    return result
  }
  async createMany(sounds: soundToCreate[]) {
    const result = await this.db.sound.createMany({ data: sounds });
    return result;
  }
  async findById(id: number) {
    const sound = await this.db.sound.findFirst({ where: { id } });
    return sound;
  }
  async deleteById(id: number) {
    const result = await this.db.sound.delete({
      where: { id },
    });
    return result;
  }
}
