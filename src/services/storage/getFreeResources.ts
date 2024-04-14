import { _Object } from "@aws-sdk/client-s3";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { StorageError } from "../../errors/general/general.js";
import { FreeResourceObj } from "../../types/index.js";

export const getFreeSoundFolderContent = async (soundFolder: string) => {
  if (!soundFolder) {
    throw new StorageError("Sound folder cannot be empty", {});
  }
  const resource = await storageFacade().storageService.getManyByFolder(
    `free/sounds/${soundFolder}`
  );
  if (!resource.Contents) {
    throw new StorageError(
      "No contents found in free/sounds " + soundFolder,
      {}
    );
  }
  return resource.Contents;
};
export const getManyFreeSoundFolderContent = async (
  soundFolders: string[]
): Promise<FreeResourceObj> => {
  if (!soundFolders.length) {
    throw new StorageError("SoundFolders cannot be empty", {});
  }
  const result = await Promise.all(
    soundFolders.map(
      async (folder): Promise<[folder: string, contents: _Object[]]> => {
        const contents = await getFreeSoundFolderContent(folder);

        return [folder, contents];
      }
    )
  );
  return result.reduce<FreeResourceObj>(
    (acc: FreeResourceObj, [folder, contents]) => {
      acc[folder] = contents;
      return acc;
    },
    {}
  );
};
