import { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { extractFolderAndFileName } from "../../api/sound/helper.js";
import storageFacade from "../../core/facade/services/storageFacade.js";
import {
  bytesToMB,
  getRandomValueFromArray,
  hashPassword,
} from "../../utils/utils.js";
import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";

export const seed = async (prisma: PrismaClient) => {
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

  const createKeyboardFromSoundStorage = async (
    userId: number,
    soundFolderId: number,
    keyboardName: string,
    s3ListOfObjects: ListObjectsV2CommandOutput,
    keys = [
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
            level: 1,
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
  ) => {
    if (!s3ListOfObjects.Contents) return;

    const soundIds = await Promise.all(
      s3ListOfObjects.Contents.filter((obj) => obj.Size).map(async (object) => {
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

    let keyIds: number[] = await Promise.all(
      keys.map(async (_key, i) => {
        if (soundIds[i]) {
          const keyCreated = await prisma.key.create({
            data: {
              soundId: soundIds[i],
              key: _key.key,
              userId,
              displayName: _key.key,
              order: i + 1,
              effects: {
                create: config.effects
                  .filter((ef) => ef.keys && !ef.isPremium)
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
        name: keyboardName,
        design_keyboardName: getRandomValueFromArray(config.design.free.names),
        keys: {
          connect: keyIds
            .filter((id) => id !== 0)
            .map((id) => {
              return { id };
            }),
        },
        effects: {
          create: config.effects
            .filter((ef) => ef.keyboards && !ef.isPremium)
            .map(({ name, description, config, isActive }) => {
              return { name, description, config, isActive };
            }),
        },
      },
    });

    return keyboard;
  };
  const pianoSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/piano"
  );
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    "Piano 1",
    pianoSounds
  );
  const hipHopSounds = await storageFacade.storageService.getManyByFolder(
    "free/sounds/hip-hop"
  );
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    "Hip-hop 1",
    hipHopSounds,
    [
      {
        key: "q",
        code: 81,
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
  console.log(lofiSounds.Contents);
  await createKeyboardFromSoundStorage(
    userId,
    freeFolder.id,
    "lofi 1",
    lofiSounds,
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
            level: 1,
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
  console.log("FREE USER SEED COMPLETED");
};
