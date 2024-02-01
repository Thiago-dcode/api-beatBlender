import { PrismaClient } from "@prisma/client";
import { UnknowDbError } from "../../errors/db/db.js";

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
  async findById(id: number) {
    return await this.db.user.findFirst({
      where: {
        id,
      },
    });
  }
  async setRefreshToken(id: number, refreshToken: string| null) {
    try {
      await this.db.user.update({
        where: { id },
        data: { token: refreshToken },
      });
      return this;
    } catch (error) {
      console.error("Error updating refresh token:", error);
      throw new UnknowDbError(
        `Failed to update refresh token for user with ID ${id}. ` +
          (error instanceof Error ? error.message : "")
      );
    }
  }
}
