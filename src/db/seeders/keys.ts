import { PrismaClient, Sound } from "@prisma/client";
import { truncateString } from "../../utils/utils.js";
import config from "../../config/config.js";
import categoryFacade from "../../core/facade/categoryFacade.js";
import { SoundWithSoundFolderOrUndefinedArray } from "../../types/index.js";

export async function seed(
  db: PrismaClient,
  sounds: { [key: string]: SoundWithSoundFolderOrUndefinedArray }
) {
  try {
    const _keys = ["q", "w", "e", "u", "i", "o", "a", "s", "d", "j", "k", "l"];

    const __keys = await Promise.all(
      Object.entries(sounds).map(async ([folder, sounds]) => {
        const { id: categoryId } =
          await categoryFacade().categoryService.findByNameOrCreate(folder);

        const keys = await Promise.all(
          sounds.map(async (sound, i) => {
            if (!sound || !_keys[i]) return undefined;
            const key = await db.key.create({
              data: {
                userId: sound.userId,
                key: _keys[i],
                displayName: _keys[i],
                name: truncateString(sound.name),
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

        return keys;
      })
    );

    return __keys.flat();
  } catch (error) {
    console.log("---ERROR SEEDING KEYS", error);
  }
}
