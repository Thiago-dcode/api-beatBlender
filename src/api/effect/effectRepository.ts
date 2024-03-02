import { PrismaClient } from "@prisma/client";
import { Effects } from "./types.js";

export default class EffectRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async create(data: Effects) {
    return await this.db.effect.create({
      data,
    });
  }
  async createMany(data: Effects[]) {
    return await this.db.effect.createMany({
      data,
    });
  }
}
