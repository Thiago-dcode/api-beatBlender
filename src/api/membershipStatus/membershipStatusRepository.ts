import { PrismaClient } from "@prisma/client";
import { membershipStatusToCreate } from "./types.js";
import { ZodNumberDef } from "zod";

export default class MembershipSatusRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async findFirstByUserInfo(id: number) {
    return await this.db.membership_status.findFirst({
      where: { user_infoId: id },
      include: { membership: true },
    });
  }
  async create(data: membershipStatusToCreate) {
    return await this.db.membership_status.create({ data });
  }
  async deleteByUserInfo(id: number) {
    return await this.db.membership_status.delete({
      where: { user_infoId: id },
    });
  }
}
