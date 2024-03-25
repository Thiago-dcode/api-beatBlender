import { PrismaClient, User } from "@prisma/client";

export async function seed(db: PrismaClient, users: User[]) {
  const usersInfo = await Promise.all(
    users.map(async (user) => {
      const data = {
        sounds: 0,
        space: 0,
        keyboards: 0,
        isAdmin: false,
      };

      const userInfo = await db.user_info.create({
        data: {
          ...data,
          id: user.id,
        },
      });
      return userInfo;
    })
  );
  console.log('---USERINFO SEEDER FINISH---')
  return usersInfo;
}
