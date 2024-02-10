import { PrismaClient, User_info } from "@prisma/client";
import { UserInfoToUpdate, userInfoToCreate } from "./types.js";

export default class UserInfoRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async create(data: userInfoToCreate) {
    return await this.db.user_info.create({ data });
  }
  async findFirstByUserId(userId: number) {
    return await this.db.user_info.findFirst({
      where: { userId },
      include: { membership_status: true },
    });
  }

  async update(id: number, data: UserInfoToUpdate) {
    return await this.db.user_info.update({
      where: { id },
      data,
    });
  }
  async deleteByUserId(userId: number) {
    return await this.db.user_info.delete({
      where: { userId },
    });
  }
}
