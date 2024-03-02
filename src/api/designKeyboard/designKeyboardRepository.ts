import { PrismaClient } from "@prisma/client";
import { designKeyboardToCreate } from "./types.js";

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
  async create({ name, path, colors }: designKeyboardToCreate) {
    const result = await this.db.design_keyboard.create({
      data: {
        name,
        path,
        colors: {
          connect: colors.map((color) => {
            return { color };
          }),
        },
      },
    });
    return result;
  }
  async createMany(data: designKeyboardToCreate[]) {
    const result = await this.db.design_keyboard.createMany({
      data: data.map((obj) => {
        return {
          name: obj.name,
          path: obj.path,
        };
      }),
    });
    return result;
  }
  async findByName(name: string) {
    const design = await this.db.design_keyboard.findFirst({ where: { name } ,include:{colors:true}});
    return design;
  }
  async deleteByName(name: string) {
    const result = await this.db.design_keyboard.delete({
      where: { name },
    });
    return result;
  }
}
