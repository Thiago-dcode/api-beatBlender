import { PrismaClient, Sound, User } from "@prisma/client";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { _Object } from "@aws-sdk/client-s3";
import { extractFolderAndFileName } from "../../api/sound/helper.js";
import { bytesToMB, getRandomUniqueFromArray } from "../../utils/utils.js";
import { StorageError } from "../../errors/general/general.js";
import soundFolderFacade from "../../core/facade/soundFolderFacade.js";
import { getManyFreeSoundFolderContent } from "../../services/storage/getFreeResources.js";
export async function seed(db: PrismaClient, users: User[]) {
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
  const freeSoundsFolders = await getManyFreeSoundFolderContent(["piano"]);

  const soundsBeta = await Promise.all( users.map(async (user) => {
    const sounds = await Promise.all(
      freeSoundsFolders.map(async ([folder, content], i) => {
        const { id } =
          await soundFolderFacade().soundFolderService.getByNameOrCreateOrError(
            folder,
            user.id
          );
        const userSounds = await createSoundsByContents(
          db,
          content,
          user.id,
          id
        );
        return userSounds;
      })
    );
    return sounds;
  }));

  console.log("---SOUND SEEDER FINISH---", soundsBeta);
  const _sounds = soundsBeta.flat().filter((sound) => sound);
  return _sounds;
}

export const createSoundsByContents = async (
  db: PrismaClient,
  contents: _Object[],
  userId: number,
  soundFolderId: number
) => {
  const sounds = await Promise.all(
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
