import { PrismaClient} from "@prisma/client";

export default class categoryRepository{
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }

  async findFirstById(id: number) {
    return await this.db.category.findFirst({ where: { id } });
  }
}
