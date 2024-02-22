import { PrismaClient } from "@prisma/client";
import { designKeyboardToCreate, designKeyboardToUpdate } from "./types.js";

export default class DesignKeyboardRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  // async findManyByUserId(userId: number) {
  //   return await this.db.design_keyboard.findMany({
  //     where: {
  //       userId,
  //     },
  //   });
  // }
  // async update(id: number, data: soundToUpdate) {
  //   const result = await this.db.design_keyboard.update({
  //     where: { id },
  //     data,
  //   });
  //   return result;
  // }
  // async updateMany(userId: number, data: soundToUpdate[]) {
  //   const result = await this.db.design_keyboard.updateMany({
  //     where: { userId },
  //     data,
  //   });
  //   return result;
  // }
  async create(data: designKeyboardToCreate) {
    const result = await this.db.design_keyboard.create({
      data: {
        name: data.name,
        colors: {
          connectOrCreate: data.colors.map((color) => {
            return { create: { color }, where: { color } };
          }),
        },
      },
    });
    return result;
  }
  async findById(id: number) {
    const sound = await this.db.design_keyboard.findFirst({ where: { id } });
    return sound;
  }
  async deleteById(id: number) {
    const result = await this.db.design_keyboard.delete({
      where: { id },
    });
    return result;
  }
}
