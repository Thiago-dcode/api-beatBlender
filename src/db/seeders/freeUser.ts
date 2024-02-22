import { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { extractFolderAndFileName } from "../../api/sound/helper.js";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { bytesToMB, hashPassword } from "../../utils/utils.js";
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
    keysLetter = ["q", "w", "e", "u", "i", "o", "a", "s", "d", "j", "k", "l"]
  ) => {
    if (!s3ListOfObjects.Contents) return;

    const soundIds = await Promise.all(
      s3ListOfObjects.Contents.map(async (object) => {
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
      keysLetter.map(async (letter, i) => {
        if (soundIds[i]) {
          const key = await prisma.key.create({
            data: {
              soundId: soundIds[i],
              letter,
              userId,
            },
          });
          return key.id;
        }
        return 0;
      })
    );
    const keyboard = await prisma.keyboard.create({
      data: {
        userId,
        name: keyboardName,
        keys: {
          connect: keyIds
            .filter((id) => id !== 0)
            .map((id) => {
              return { id };
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
    hipHopSounds
  );

  console.log("FREE USER SEED COMPLETED");
};
