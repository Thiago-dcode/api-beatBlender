import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";

export const seed = async (prisma: PrismaClient) => {
  const freeConfig = config.membership.free;
  const freeMembership = await prisma.membership.create({
    data: {
      id: freeConfig.id,
      name: freeConfig.name,
      space: 200,
      keyboards: 10,
      sounds: 50,
      price: null,
      description: "The free memembership",
    },
  });

  console.log("MEMBERSHIP SEED COMPLETED");
};
