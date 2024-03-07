import { ListObjectsV2CommandOutput, _Object } from "@aws-sdk/client-s3";
import { extractFolderAndFileName } from "../../api/sound/helper.js";
import storageFacade from "../../core/facade/services/storageFacade.js";
import {
  bytesToMB,
  getRandomFreeDesign,
  getRandomUniqueFromArray,
  getRandomValueFromArray,
  hashPassword,
} from "../../utils/utils.js";
import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";

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

type Key = typeof key & {
  displayName?: string;
  bgColor?: string;
  keyColor?: string;
};

export const seed = async (prisma: PrismaClient) => {
  const createKeyboardFromSoundStorage = async (
    userId: number,
    soundFolderId: number,
    keyboardData: {
      name: string;
      private: boolean;
      designName?: string;
    },
    contents: _Object[] | undefined,
    keys: Key[]
  ) => {
    if (!contents) return;

    const soundIds = await Promise.all(
      contents
        .filter((obj) => obj.Size)
        .map(async (object) => {
          const path = object?.Key;
          if (!path) return undefined;
          const sound = await prisma.sound.create({
            data: {
              userId,
              name: extractFolderAndFileName(path).filename,
              path,
              size: bytesToMB(object?.Size || 0),
              sound_folderId: soundFolderId,
            },
          });
          return sound.id;
        })
    );
    const design_keyboardName =
      keyboardData.designName || getRandomFreeDesign();
    let keyIds: number[] = await Promise.all(
      keys.map(async (_key, i) => {
        if (soundIds[i]) {
          const colors = config.design.free.designs.filter(
            (d) => d.name === design_keyboardName
          )[0].colors;
          const bgColor = getRandomValueFromArray(colors);
          const keyCreated = await prisma.key.create({
            data: {
              soundId: soundIds[i],
              key: _key.key,
              userId,
              displayName: _key.displayName || _key.key,
              order: i + 1,
              bgColor: _key.bgColor || bgColor,
              keyColor:
                _key.keyColor ||
                getRandomValueFromArray(
                  colors.filter((color) => !color.includes(bgColor))
                ),
              effects: {
                create: config.effects
                  .filter((ef) => ef.keys)
                  .map(({ name, description, config, isActive }) => {
                    return {
                      name,
                      description,
                      config:
                        name === "loop" ? _key.loop.config : _key.volume.config,
                      isActive:
                        name === "loop" ? _key.loop.active : _key.volume.active,
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
    const keyboard = await prisma.keyboard.create({
      data: {
        userId,
        name: keyboardData.name,
        design_keyboardName,
        private: keyboardData.private,
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

  const pianoSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/piano"
  );
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    { name: "Piano 1", private: false },
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
    ]
  );
  const hipHopSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/hip-hop"
  );
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    { name: "hip-hop 1", private: false },
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
    ]
  );
  const lofiSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/lofi"
  );
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    { name: "lofi 1", private: false },
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
    ]
  );

  // private keyboards: errors, register, login

  //TODO:

  const registerSounds = await storageFacade.storageService.getManyByFolder(
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
    ]
  );
  const loginSounds = await storageFacade.storageService.getManyByFolder(
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
     
    ]
  );
  const errorSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/memes/fail"
  );
  const error404Sounds = getRandomUniqueFromArray(errorSounds.Contents, 3);
  await createKeyboardFromSoundStorage(
    userId,
    beatBlenderFolder.id,
    { name: "404", private: true },
    error404Sounds,
    [
      {
        key: "4",

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
        key: "0",
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
        key: "f4",
        displayName: "4",
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
    ]
  );

  const error500Sounds = getRandomUniqueFromArray(errorSounds.Contents, 3);
  await createKeyboardFromSoundStorage(
    userId,
    beatBlenderFolder.id,
    { name: "500", private: true, designName: "minimal" },
    error500Sounds,
    [
      {
        key: "5",
        code: 81,
        bgColor: "white",
        keyColor: "black",
        displayName: "5",
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
        key: "0",
        code: 87,
        bgColor: "white",
        keyColor: "black",
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
        key: "-",
        displayName: "0",
        code: 69,
        bgColor: "white",
        keyColor: "black",
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
    ]
  );

  console.log("FREE USER SEED COMPLETED");
};
