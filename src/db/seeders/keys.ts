import { PrismaClient, Sound } from "@prisma/client";
import { truncateString } from "../../utils/utils.js";
import config from "../../config/config.js";
import categoryFacade from "../../core/facade/categoryFacade.js";

export async function seed(db: PrismaClient, sounds: (Sound | undefined)[]) {
try {
    const _keys = ["q", "w", "e", "u", "i", "o", "a", "s", "d", "j", "k", "l"];
    const { id: categoryId } =
      await categoryFacade().categoryService.findByNameOrCreate("free");
    const keys = await Promise.all(
      sounds.map(async (sound, i) => {
        if (_keys.length === i || !sound) {
          return undefined;
        }
        const key = await db.key.create({
          data: {
            userId: sound.userId,
            key: _keys[i],
            displayName: _keys[i],
            name: truncateString(sound.name),
            bgColor: "rgb(38,38,38)",
            keyColor: "rgb(217,217,217)",
            soundId: sound.id,
            categoryId,
            effects: {
              create: config.effects
                .filter((ef) => ef.keys)
                .map(({ name, description, config, isActive }) => {
                  return {
                    name,
                    description,
                    config,
                    isActive,
                  };
                }),
            },
          },
        });
  
        return key;
      })
    );
    console.log("---KEYS SEEDER FINISH---");
    return keys;
} catch (error) {
    console.log("---ERROR SEEDING KEYS", error);
}
}
