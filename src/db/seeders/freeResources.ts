import { ListObjectsV2CommandOutput, _Object } from "@aws-sdk/client-s3";
import storageFacade from "../../core/facade/services/storageFacade.js";
import {
  bytesToMB,
  getRandomFreeDesign,
  getRandomUniqueFromArray,
  getRandomValueFromArray,
  hashPassword,
  truncateString,
} from "../../utils/utils.js";
import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";
import categoryFacade from "../../core/facade/categoryFacade.js";
import { createSoundsByContents } from "./sounds.js";

const key = {
  key: "q",
  code: 81,
  loop: {
    active: false,
    config: {
      bpm: 0,
    },
  },
  volume: {
    active: true,
    config: {
      level: 1,
    },
  },
};
type KeyboardData = {
  name: string;
  private: boolean;
  description?: string;
  designName?: string;
};
type Key = typeof key & {
  name?: string;
  displayName?: string;
  bgColor?: string;
  keyColor?: string;
};

export const seed = async (prisma: PrismaClient) => {
  try {
    const storageService = storageFacade().storageService
 
    const createKeyboardFromSoundStorage = async (
      userId: number,
      soundFolderId: number,
      keyboardData: KeyboardData,
      contents: _Object[] | undefined,
      keys: Key[],
      category: string | undefined = undefined
    ) => {
      if (!contents) return;

      const _category = await categoryFacade().categoryService.findByNameOrCreate(
        category
      );
      const sounds = await createSoundsByContents(
        prisma,
        contents,
        userId,
        soundFolderId
      );
    const design_keyboardName =
        keyboardData.designName || getRandomFreeDesign();
      let keyIds: number[] = await Promise.all(
        keys.map(async (_key, i) => {
          if (sounds[i]) {
            const colors = config.design.free.designs.filter(
              (d) => d.name === design_keyboardName
            )[0].colors;
            const bgColor = !keyboardData?.designName
              ? getRandomValueFromArray(colors)
              : undefined;
            const keyColor = bgColor
              ? getRandomValueFromArray(
                  colors.filter((color) => !color.includes(bgColor))
                )
              : undefined;
            const keyCreated = await prisma.key.create({
              data: {
                name: _key.name || truncateString(sounds[i]?.name || ""),
                soundId: sounds[i]?.id,
                key: _key.key,
                userId,
                categoryId: _category.id,
                displayName: _key.displayName || _key.key,
                order: i + 1,
                bgColor: _key.bgColor || bgColor,
                keyColor: _key.keyColor || keyColor,
                effects: {
                  create: config.effects
                    .filter((ef) => ef.keys)
                    .map(({ name, description, config, isActive }) => {
                      return {
                        name,
                        description,
                        config:
                          name === "loop"
                            ? _key.loop.config
                            : _key.volume.config,
                        isActive:
                          name === "loop"
                            ? _key.loop.active
                            : _key.volume.active,
                      };
                    }),
                },
              },
            });
            return keyCreated.id;
          }
          return 0;
        })
      );
      const { name, private: _private, description } = keyboardData;
      const keyboard = await prisma.keyboard.create({
        data: {
          userId,
          name: name,
          design_keyboardName,
          description,
          private: _private,
          keys: {
            connect: keyIds
              .filter((id) => id !== 0)
              .map((id) => {
                return { id };
              }),
          },
          effects: {
            create: config.effects
              .filter((ef) => ef.keyboards)
              .map(({ name, description, config, isActive }) => {
                return { name, description, config, isActive };
              }),
          },
        },
      });

      return keyboard;
    };

    const hashedPassword = await hashPassword("pokemon94");
    const freeUser = await prisma.user.create({
      data: {
        username: config.user.free.username,
        email: "free@beatblender.com",
        name: "Free Beat Blender",
        password: hashedPassword,
        avatar: "free/avatar/avatar",
      },
    });

    const userId = freeUser.id;
    const userInfo = await prisma.user_info.create({
      data: {
        isAdmin: true,
        id: userId,
        keyboards: -1,
        space: -1,
        sounds: -1,
      },
    });
    const freeFolder = await prisma.sound_folder.create({
      data: {
        name: "free",
        userId,
        is_default: true,
      },
    });
    const beatBlenderFolder = await prisma.sound_folder.create({
      data: {
        name: "app",
        userId,
        is_default: false,
      },
    });

    const pianoSounds = await storageService.getManyByFolder(
      "free/sounds/piano"
    );
    await createKeyboardFromSoundStorage(
      userId,
      freeFolder.id,
      {
        designName: "classic-1",
        name: "Piano 1",
        private: false,
        description: "Free piano Beat Blender keyboard",
      },
      pianoSounds.Contents,
      [
        {
          key: "q",
          code: 81,
          loop: {
            active: true,
            config: {
              bpm: 120,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "w",
          code: 87,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "e",
          code: 69,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0,
            },
          },
        },
        {
          key: "u",
          code: 85,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "i",
          code: 73,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "o",
          code: 79,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "a",
          code: 65,
          loop: {
            active: true,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "s",
          code: 83,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "d",
          code: 68,
          loop: {
            active: true,
            config: {
              bpm: 120,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "j",
          code: 74,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "k",
          code: 75,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "l",
          code: 76,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
      ],
      "piano"
    );
    const hipHopSounds = await storageService.getManyByFolder(
      "free/sounds/hip-hop"
    );
    await createKeyboardFromSoundStorage(
      userId,
      freeFolder.id,
      {
        designName: "beat-blender",
        name: "hip-hop 1",
        private: false,
        description: "Free hip-hop Beat Blender keyboard",
      },
      hipHopSounds.Contents,
      [
        {
          key: "q",
          code: 81,
          loop: {
            active: true,
            config: {
              bpm: 120,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "w",
          code: 87,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "e",
          code: 69,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0,
            },
          },
        },
        {
          key: "u",
          code: 85,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "i",
          code: 73,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "o",
          code: 79,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "a",
          code: 65,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "s",
          code: 83,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "d",
          code: 68,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "j",
          code: 74,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "k",
          code: 75,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "l",
          code: 76,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
      ],
      "hip-hop"
    );
    const lofiSounds = await storageService.getManyByFolder(
      "free/sounds/lofi"
    );
    await createKeyboardFromSoundStorage(
      userId,
      freeFolder.id,
      {
        designName: "minimal",
        name: "lofi 1",
        private: false,
        description: "Free lofi Beat Blender keyboard",
      },
      lofiSounds.Contents,
      [
        {
          key: "q",
          code: 81,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0.2,
            },
          },
        },
        {
          key: "w",
          code: 87,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 2,
            },
          },
        },
        {
          key: "e",
          code: 69,
          loop: {
            active: true,
            config: {
              bpm: 80,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0.8,
            },
          },
        },
        {
          key: "u",
          code: 85,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "i",
          code: 73,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "o",
          code: 79,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "a",
          code: 65,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "s",
          code: 83,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "d",
          code: 68,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "j",
          code: 74,
          loop: {
            active: true,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "k",
          code: 75,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0,
            },
          },
        },
        {
          key: "l",
          code: 76,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 0,
            },
          },
        },
      ],
      "lofi"
    );

    // private keyboards: errors, register, login

    //TODO:

    const registerSounds = await storageService.getManyByFolder(
      "free/sounds/register"
    );
    await createKeyboardFromSoundStorage(
      userId,
      beatBlenderFolder.id,
      { name: "register", private: true, designName: "minimal" },
      registerSounds.Contents,
      [
        {
          key: "r",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 81,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "e",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 87,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "g",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 69,
          loop: {
            active: false,
            config: {
              bpm: 80,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "i",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 85,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "s",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 73,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "t",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 79,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "f1",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          displayName: "e",
          code: 65,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "f2",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          displayName: "r",
          code: 83,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
      ],
      "memes"
    );
    const loginSounds = await storageService.getManyByFolder(
      "free/sounds/login"
    );
    await createKeyboardFromSoundStorage(
      userId,
      beatBlenderFolder.id,
      { name: "login", private: true, designName: "minimal" },
      loginSounds.Contents,
      [
        {
          key: "l",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 81,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "o",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 87,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "g",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 69,
          loop: {
            active: false,
            config: {
              bpm: 80,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "i",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 85,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
        {
          key: "n",
          bgColor: "rgb(245 245 245)",
          keyColor: "rgb(38 38 38)",
          code: 73,
          loop: {
            active: false,
            config: {
              bpm: 0,
            },
          },
          volume: {
            active: true,
            config: {
              level: 1,
            },
          },
        },
      ],
      "memes"
    );

    console.log("FREE RESOURCES SEED COMPLETED");
  } catch (error) {
    console.error("ERROR SEEDING FREE RESOURCES", error);
  }
};
