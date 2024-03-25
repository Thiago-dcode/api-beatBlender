import { PrismaClient } from "@prisma/client";
import { Effects } from "./types.js";
import { whereUnique } from "../user/types.js";

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
  async findManyWhere(where: any) {
    return await this.db.effect.findMany({
      where,
    });
  }
  async createMany(data: Effects[]) {
    return await this.db.effect.createMany({
      data,
    });
  }
}
