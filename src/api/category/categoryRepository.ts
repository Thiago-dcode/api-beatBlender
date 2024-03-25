import { Prisma, PrismaClient } from "@prisma/client";

export default class categoryRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async findFirstById(id: number) {
    return await this.db.category.findFirst({ where: { id } });
  }

  async findFirstWhere(where: Prisma.CategoryWhereUniqueInput) {
    return await this.db.category.findFirst({ where });
  }
  async createByName(name: string) {
    return await this.db.category.create({ data: { name } });
  }
}
