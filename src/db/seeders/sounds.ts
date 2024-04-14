import { PrismaClient, Sound, Sound_folder, User } from "@prisma/client";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { _Object } from "@aws-sdk/client-s3";
import { extractFolderAndFileName } from "../../api/sound/helper.js";
import { bytesToMB } from "../../utils/utils.js";
import { StorageError } from "../../errors/general/general.js";
import soundFolderFacade from "../../core/facade/soundFolderFacade.js";
import {
  FreeResourceObj,
  SoundWithSoundFolderOrUndefinedArray,
} from "../../types/index.js";

export async function seed(
  db: PrismaClient,
  users: User[],
  freeResources: FreeResourceObj
) {
  const { Contents } = await storageFacade().storageService.getManyByFolder(
    "free/sounds"
  );
  if (!Contents) {
    throw new StorageError(
      "No contents found in  free/sounds folder.",
      {},
      500
    );
  }

  const soundsFolders = ["piano",'hip-hop','lofi'];
  const sounds = await Promise.all(
    users.map(async (user) => {
      const result = await Promise.all(
        soundsFolders.map(
          async (
            folder
          ): Promise<
            [folder: string, sounds: SoundWithSoundFolderOrUndefinedArray]
          > => {
            const { id } =
              await soundFolderFacade().soundFolderService.getByNameOrCreateOrError(
                folder,
                user.id
              );

            const userSounds = await createSoundsByContents(
              db,
              freeResources[folder],
              user.id,
              id
            );
            return [folder, userSounds];
          }
        )
      );

      return result;
    })
  );
  return sounds
    .flat()
    .reduce(
      (
        acc: { [key: string]: SoundWithSoundFolderOrUndefinedArray },
        curr
      ): { [key: string]: SoundWithSoundFolderOrUndefinedArray } => {
        const [folder, sounds] = curr;
        acc[folder] = sounds;
        return acc;
      },
      {}
    );
}
export const createSoundsByContents = async (
  db: PrismaClient,
  contents: _Object[],
  userId: number,
  soundFolderId: number
): Promise<SoundWithSoundFolderOrUndefinedArray> => {
  const sounds: SoundWithSoundFolderOrUndefinedArray = await Promise.all(
    contents
      .filter((obj) => obj.Size)
      .map(async (object) => {
        const path = object?.Key;
        if (!path) return undefined;
        const sound = await db.sound.create({
          data: {
            userId,
            name: extractFolderAndFileName(path).filename,
            path,
            size: bytesToMB(object?.Size || 0),
            sound_folderId: soundFolderId,
          },
          include: { Sound_folder: true },
        });
        return sound;
      })
  );

  return sounds;
};
