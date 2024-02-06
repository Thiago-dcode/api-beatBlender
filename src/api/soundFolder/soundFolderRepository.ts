import { PrismaClient } from "@prisma/client";
import { SoundFolderToCreate, SoundFolderToUpdate } from "./types.js";

type Where = {
  userId?: number;
  name?: string;
  isDefault?: boolean;
};
export default class SoundFolderRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
    this.db.$connect();
  }
  async findManyByUserId(userId: number) {
    return await this.db.sound_folder.findMany({
      where: {
        userId,
      },
      include: {
        Sound: true,
      },
    });
  }
  async findById(id: number) {
    return await this.db.sound_folder.findFirst({ where: { id } });
  }
  async findFirstWhere(where: Where) {
    const sound_folder = await this.db.sound_folder.findFirst({
      where,
    });
    return sound_folder;
  }
  async update(id: number, data: SoundFolderToUpdate) {
    const result = await this.db.sound_folder.update({
      where: { id },
      data,
    });
    return result;
  }
  async create(data: SoundFolderToCreate) {
    const result = await this.db.sound_folder.create({
      data,
    });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.db.sound_folder.delete({
      where: { id },
    });
    return result;
  }
}
