import { PrismaClient} from "@prisma/client";

export default class MembershipRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async findFirstById(id: number) {
    return await this.db.membership.findFirst({ where: { id } });
  }
}
