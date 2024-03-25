import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/utils.js";

export async function seed(db: PrismaClient) {
  const password = await hashPassword("12345678");
  const arrData = [
    {
      name: "thiago",
      password: password,
      username: "thiago123",
      email: "thiago@gmail.com",
    },
  ];

  const usersCreated = await Promise.all(
    arrData.map(async (data) => {
      const user = await db.user.create({
        data,
      });

      return user;
    })
  );
  console.log('---USER SEEDER FINISH---')
  return usersCreated
}
