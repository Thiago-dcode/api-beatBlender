import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";

export const seed = async (prisma: PrismaClient) => {
  const effects = config.effects;

  const effectsCreated = await Promise.all(
    effects.map(async (effect) => {
      const { name, description, isActive, config } = effect;

      const effectCreated = await prisma.effect.create({
        data: {
          name,
          description,
          config,
          isActive,
        },
      });
      return effectCreated;
    })
  );

  console.log("EFFECTS SEEDED SUCCESFULLY: ", effectsCreated);
};
