import { PrismaClient } from "@prisma/client";

export default class authRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async findByUsername(username: string) {
    return await this.db.user.findFirst({
      where: {
        username,
      },
    });
  }
}
