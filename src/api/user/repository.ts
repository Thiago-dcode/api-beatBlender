import { PrismaClient } from "@prisma/client";
interface User {
  username: string;
  email?: string;
  name?: string;
  password: string;
}
export default class UserRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async all(options = {}) {
    const users = await this.db.user.findMany(options);
    return users;
  }

  async new(data: User) {
    const user = await this.db.user.create({
      data,
    });
    return user;
  }

  getById(id: number) {
    // call persistence.js
  }
}
