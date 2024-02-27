import { PrismaClient } from "@prisma/client";

export default class ColorRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async findFirstByName(color: string) {
    return await this.db.color.findFirst({ where: { color } });
  }

  async create(color: string) {
    return await this.db.color.create({ data: { color } });
  }
}
