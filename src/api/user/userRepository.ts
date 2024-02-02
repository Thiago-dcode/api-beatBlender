import { Prisma, PrismaClient } from "@prisma/client";
import { CreateUser, UpdateUser } from "./types.js";
import { PrismaClientOptions } from "@prisma/client/runtime/library.js";

export default class UserRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async all(options = {}) {
    const users = await this.db.user.findMany(options);
    return users;
  }

  async new(data: CreateUser) {
    const user = await this.db.user.create({
      data,
    });
    return user;
  }
  async updateByUsername(username: string, data: UpdateUser) {
    const user = await this.db.user.update({
      where: {
        username,
      },
      data,
    });
    return user;
  }

  async findByColumn(column: "id" | "username" | "email", value: any) {
    const where = { [column]: value };
    return await this.db.user.findFirst({
      where,
    });
  }
  async deleteWhere(where: Prisma.UserWhereUniqueInput) {
    return await this.db.user.delete({
      where,
    });
  }
}
