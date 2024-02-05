import { Prisma, PrismaClient, Sound } from "@prisma/client";
import { UnknowDbError } from "../../errors/db/db.js";
import { soundToCreate } from "./types.js";

export default class SoundRepository {
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
  async createMany(sounds: soundToCreate[]) {
    const result = await this.db.sound.createMany({ data: sounds });
  }
  async findById(id: number) {
    const sound = await this.db.sound.findFirst({ where: { id } });
    return sound;
  }
}
